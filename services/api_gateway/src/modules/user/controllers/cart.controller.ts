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
import { Product } from "src/model/Product";
import { CartEventHandler } from "../event-handlers/CartEventHandler";

@Controller("cart")
export class CartController {
  constructor(@Inject("KAFKA_CLIENT") private readonly client: ClientKafka) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  updateCart(@Body() body: UpdateCartRequestDto, @Request() req: any) {
    const userEmail = req.user.email as string;
    const { cart } = body;

    const updateCartEvent: UpdateCartEvent = {
      type: "UPDATE_CART",
      email: userEmail,
      cart: cart,
    };

    this.client.emit("user", updateCartEvent);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCart(@Request() req: any): Promise<GetCartResponseDto> {
    const userEmail = req.user.email as string;

    const requestEvent: GetCartRequestEvent = {
      type: "GET_CART_REQUEST",
      email: userEmail,
    };
    this.client.emit("user", requestEvent);
    const requestId = RequestIdGenerator.generateCartRequestId(userEmail);

    const cart = await this.waitForCartResponse(requestId);

    const cartProductIds = cart.map((val) => val.id);
    const metaDataRequestId = this.sendGetMetaDataRequestEvent(cartProductIds);

    const metaData = await this.waitForMetaDataResponse(metaDataRequestId);

    const finalCart: any[] = [];
    for (const item of cart) {
      const correspondingMetaData = metaData.find(
        (meta) => meta.id === item.id,
      );
      finalCart.push({ ...item, ...correspondingMetaData });
    }

    return { cart: finalCart };
  }

  private waitForCartResponse(requestId: string): Promise<CartProduct[]> {
    return PendingRequestHolder.holdConnection<CartProduct[]>(
      (complete, abort) => {
        if (CartEventHandler.responseCache.has(requestId)) {
          const responseEvent = CartEventHandler.responseCache.get(
            requestId,
          ) as GetCartResponseEvent;
          CartEventHandler.responseCache.del(requestId);
          complete(responseEvent.cart);
        }
      },
    );
  }

  private sendGetMetaDataRequestEvent(productIds: string[]): string {
    const metaDataRequestEvent: GetMetadataRequestEvent = {
      type: "GET_METADATA_REQUEST",
      products: productIds,
    };
    this.client.emit("products", metaDataRequestEvent);
    return RequestIdGenerator.generateMetaDataRequestId(productIds);
  }

  private waitForMetaDataResponse(requestId: string): Promise<Product[]> {
    return PendingRequestHolder.holdConnection((complete, abort) => {
      if (CartEventHandler.responseCache.has(requestId)) {
        const responseEvent = CartEventHandler.responseCache.get(
          requestId,
        ) as GetMetadatResponseEvent;
        CartEventHandler.responseCache.del(requestId);

        complete(responseEvent.products);
      }
    });
  }
}
