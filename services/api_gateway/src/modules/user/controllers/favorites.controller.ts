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
import { JwtAuthGuard } from "src/modules/auth/jwt-auth.guard";
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
import { PendingRequestHolder } from "src/modules/PendingRequestHolder";
import {
  GetMetadataRequestEvent,
  GetMetadatResponseEvent,
} from "../dto/events/metadata-event";

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
      const id = this.generateFavoritesRequestId(event.email);
      this.responseCache.set(id, event);
    } else if (data.type === "GET_METADATA_RESPONSE") {
      const event = data as GetMetadatResponseEvent;
      const id = this.generateMetaDataRequestId(
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
    const requestId = this.generateFavoritesRequestId(userEmail);

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
      this.client.emit("user", metaDataRequestEvent);
      const metaDataRequestId = this.generateMetaDataRequestId(favorites);
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

  private generateFavoritesRequestId(email: string) {
    return `FAVORITES-${email}`;
  }

  //Generates id based on hash of product ids
  private generateMetaDataRequestId(products: string[]) {
    let sum = 0;
    for (let i = 0; i < products.length; i++) {
      const cs = this.charsum(products[i]);
      sum = sum + 65027 / cs;
    }
    const hash = ("" + sum).slice(0, 16);

    return `METADATA-${hash}`;
  }

  private charsum(s: string) {
    let sum = 0;
    for (let i = 0; i < s.length; i++) {
      sum += s.charCodeAt(i) * (i + 1);
    }
    return sum;
  }
}
