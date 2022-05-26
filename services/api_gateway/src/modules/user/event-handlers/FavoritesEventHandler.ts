import * as NodeCache from "node-cache";
import { RequestIdGenerator } from "src/util/RequestIdGenerator";
import { GetFavoritesResponseEvent } from "../dto/events/favorite-event.dto";
import { GetMetadatResponseEvent } from "../dto/events/metadata-event";

export class FavoritesEventHandler {
  /* responseCache: Temporarily holds "RESPONSE" events. Active HTTP connections then check cache for required response
   * Expires after 15 seconds. In which case initiater HTTP connection probably expired or fulfilled*/
  static responseCache = new NodeCache({ stdTTL: 15000 });

  static handleUserEvent(data: any) {
    if (data.type === "GET_FAVORITES_RESPONSE") {
      const event = data as GetFavoritesResponseEvent;
      const id = RequestIdGenerator.generateFavoritesRequestId(event.email);
      this.responseCache.set(id, event);
    }
  }

  static handleProductsEvent(data: any) {
    if (data.type === "GET_METADATA_RESPONSE") {
      const event = data as GetMetadatResponseEvent;
      const id = RequestIdGenerator.generateMetaDataRequestId(
        event.products.map((val) => val.id),
      );
      this.responseCache.set(id, event);
    }
  }
}
