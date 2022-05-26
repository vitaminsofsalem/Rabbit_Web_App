import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  Request,
  Get,
} from "@nestjs/common";
import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";
import * as NodeCache from "node-cache";
import { JwtAuthGuard } from "src/modules/auth/jwt-auth.guard";
import {
  AddAddressRequestDto,
  GetAddressResponseDto,
} from "../dto/address.dto";
import {
  AddAddressEvent,
  GetAddressRequestEvent,
  GetAddressResponseEvent,
} from "../dto/events/address-event.dto";
import { PendingRequestHolder } from "src/util/PendingRequestHolder";
import { GetCartResponseDto, UpdateCartRequestDto } from "../dto/cart.dto";
import {
  GetCartRequestEvent,
  GetCartResponseEvent,
  UpdateCartEvent,
} from "../dto/events/cart-event.dto";
import { RequestIdGenerator } from "src/util/RequestIdGenerator";
import {
  GetMetadataRequestEvent,
  GetMetadatResponseEvent,
} from "../dto/events/metadata-event";
import { CartProduct } from "src/model/Cart";

@Controller("cart")
export class CartController {
  /* responseCache: Temporarily holds "RESPONSE" events. Active HTTP connections then check cache for required response
   * Expires after 15 seconds. In which case initiater HTTP connection probably expired or fulfilled*/
  private responseCache = new NodeCache({ stdTTL: 15000 });

  constructor(@Inject("KAFKA_CLIENT") private readonly client: ClientKafka) {}

  @MessagePattern("user")
  handleUserEvents(@Payload("value") data: any) {
    if (data.type === "GET_CART_RESPONSE") {
      const event = data as GetCartResponseEvent;
      const id = RequestIdGenerator.generateCartRequestId(event.email);
      this.responseCache.set(id, event);
    }
  }

  @MessagePattern("products")
  handleProductEvents(@Payload("value") data: any) {
    if (data.type === "GET_METADATA_RESPONSE") {
      const event = data as GetMetadatResponseEvent;
      const id = RequestIdGenerator.generateMetaDataRequestId(
        event.products.map((val) => val.id),
      );
      this.responseCache.set(id, event);
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  updateCart(@Body() body: UpdateCartRequestDto, @Request() req: any) {
    const userEmail = req.user.email as string;
    const { cart } = body;

    const updateCartEvent: UpdateCartEvent = {
      type: "UPDATE_CART",
      email: userEmail,
      cart: cart.map((val) => ({ id: val.id, quantity: val.quantity })),
    };

    this.client.emit("user", updateCartEvent);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getCart(@Request() req: any): Promise<GetCartResponseDto> {
    const userEmail = req.user.email as string;

    const requestEvent: GetCartRequestEvent = {
      type: "GET_CART_REQUEST",
      email: userEmail,
    };
    this.client.emit("user", requestEvent);
    const requestId = RequestIdGenerator.generateCartRequestId(userEmail);

    //Wait for result of products
    return PendingRequestHolder.holdConnection<
      { id: string; quantity: number }[]
    >((complete, abort) => {
      if (this.responseCache.has(requestId)) {
        const responseEvent = this.responseCache.get(
          requestId,
        ) as GetCartResponseEvent;
        this.responseCache.del(requestId);
        complete(responseEvent.cart);
      }
    }).then((cart) => {
      const cartProducts = cart.map((val) => val.id);
      const metaDataRequestEvent: GetMetadataRequestEvent = {
        type: "GET_METADATA_REQUEST",
        products: cartProducts,
      };
      this.client.emit("products", metaDataRequestEvent);
      const metaDataRequestId =
        RequestIdGenerator.generateMetaDataRequestId(cartProducts);

      //Wait for result of metadata of products
      return PendingRequestHolder.holdConnection((complete, abort) => {
        if (this.responseCache.has(metaDataRequestId)) {
          const responseEvent = this.responseCache.get(
            metaDataRequestId,
          ) as GetMetadatResponseEvent;
          this.responseCache.del(metaDataRequestId);

          const finalItems: CartProduct[] = [];
          for (const item of cart) {
            const correspondingMetaData = responseEvent.products.find(
              (meta) => meta.id === item.id,
            );
            finalItems.push({ ...item, ...correspondingMetaData });
          }

          complete({ cart: finalItems });
        }
      });
    });
  }
}
