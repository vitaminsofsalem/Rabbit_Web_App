import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  Request,
  Delete,
  Get,
} from "@nestjs/common";
import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import {
  AddFavoriteEvent,
  GetFavoritesRequestEvent,
  GetFavoritesResponseEvent,
  RemoveFavoriteEvent,
} from "../dto/events/favorite-event.dto";
import {
  EditFavoriteRequestDto,
  GetFavoriteResponseDto,
} from "../dto/favorite.dto";
import * as NodeCache from "node-cache";
import { PendingRequestHolder } from "src/util/PendingRequestHolder";
import {
  GetMetadataRequestEvent,
  GetMetadatResponseEvent,
} from "../dto/events/metadata-event";
import { RequestIdGenerator } from "src/util/RequestIdGenerator";

@Controller("favorite")
export class FavoritesController {
  /* responseCache: Temporarily holds "RESPONSE" events. Active HTTP connections then check cache for required response
   * Expires after 15 seconds. In which case initiater HTTP connection probably expired or fulfilled*/
  private responseCache = new NodeCache({ stdTTL: 15000 });

  constructor(@Inject("KAFKA_CLIENT") private readonly client: ClientKafka) {}

  @MessagePattern("user")
  handleUserEvents(@Payload("value") data: any) {
    if (data.type === "GET_FAVORITES_RESPONSE") {
      const event = data as GetFavoritesResponseEvent;
      const id = RequestIdGenerator.generateFavoritesRequestId(event.email);
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
  addFavorite(@Body() body: EditFavoriteRequestDto, @Request() req: any) {
    const userEmail = req.user.email as string;
    const { productId } = body;

    const addFavoriteEvent: AddFavoriteEvent = {
      type: "ADD_FAVORITE",
      email: userEmail,
      productId,
    };

    this.client.emit("user", addFavoriteEvent);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  removeFavorite(@Body() body: EditFavoriteRequestDto, @Request() req: any) {
    const userEmail = req.user.email as string;
    const { productId } = body;

    const removeFavoriteEvent: RemoveFavoriteEvent = {
      type: "REMOVE_FAVORITE",
      email: userEmail,
      productId,
    };

    this.client.emit("user", removeFavoriteEvent);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getFavorites(@Request() req: any): Promise<GetFavoriteResponseDto> {
    const userEmail = req.user.email as string;

    const requestEvent: GetFavoritesRequestEvent = {
      type: "GET_FAVORITES_REQUEST",
      email: userEmail,
    };
    this.client.emit("user", requestEvent);
    const requestId = RequestIdGenerator.generateFavoritesRequestId(userEmail);

    //Wait for result of products
    return PendingRequestHolder.holdConnection<string[]>((complete, abort) => {
      if (this.responseCache.has(requestId)) {
        const responseEvent = this.responseCache.get(
          requestId,
        ) as GetFavoritesResponseEvent;
        this.responseCache.del(requestId);
        complete(responseEvent.favorites);
      }
    }).then((favorites) => {
      const metaDataRequestEvent: GetMetadataRequestEvent = {
        type: "GET_METADATA_REQUEST",
        products: favorites,
      };
      this.client.emit("products", metaDataRequestEvent);
      const metaDataRequestId =
        RequestIdGenerator.generateMetaDataRequestId(favorites);
      //Wait for result of metadata of products
      return PendingRequestHolder.holdConnection((complete, abort) => {
        if (this.responseCache.has(metaDataRequestId)) {
          const responseEvent = this.responseCache.get(
            metaDataRequestId,
          ) as GetMetadatResponseEvent;
          this.responseCache.del(metaDataRequestId);
          complete({ favorites: responseEvent.products });
        }
      });
    });
  }
}
