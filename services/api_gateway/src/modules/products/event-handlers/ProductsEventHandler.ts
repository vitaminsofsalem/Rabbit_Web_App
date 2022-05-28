import * as NodeCache from "node-cache";
import { GetMetadatResponseEvent } from "src/modules/user/dto/events/metadata-event";
import { RequestIdGenerator } from "src/util/RequestIdGenerator";
import { GetCategoriesResponseEvent } from "../dto/events/get-categories.dto";
import { GetHomeResponseEvent } from "../dto/events/get-home.dto";
import { GetProductsResponseEvent } from "../dto/events/get-products.dto";
import { SearchResponseEvent } from "../dto/events/search.dto";

export class ProductsEventhandler {
  /* responseCache: Temporarily holds "RESPONSE" events. Active HTTP connections then check cache for required response
   * Expires after 15 seconds. In which case initiater HTTP connection probably expired or fulfilled*/
  static responseCache = new NodeCache({ stdTTL: 15000 });

  static handleProductsEvents(data: any) {
    if (data.type === "GET_CATEGORIES_RESPONSE") {
      const event = data as GetCategoriesResponseEvent;
      const id = RequestIdGenerator.generateGetCategoriesRequestId();
      this.responseCache.set(id, event);
    } else if (data.type === "GET_HOME_RESPONSE") {
      const event = data as GetHomeResponseEvent;
      const id = RequestIdGenerator.generateGetHomeRequestId();
      this.responseCache.set(id, event);
    } else if (data.type === "GET_PRODUCTS_RESPONSE") {
      const event = data as GetProductsResponseEvent;
      const id = RequestIdGenerator.generateGetProductsRequestId(event.filter);
      this.responseCache.set(id, event);
    } else if (data.type === "SEARCH_RESPONSE") {
      const event = data as SearchResponseEvent;
      const id = RequestIdGenerator.generateSearchProductsRequestId(
        event.searchQuery,
      );
      this.responseCache.set(id, event);
    } else if (data.type === "GET_METADATA_RESPONSE") {
      const event = data as GetMetadatResponseEvent;
      const id = RequestIdGenerator.generateMetaDataRequestId(
        event.products.map((val) => val.id),
      );
      this.responseCache.set(id, event);
    }
  }
}
