import { Product } from "src/model/Product";

export class SearchRequestEvent {
  type: "SEARCH_REQUEST";
  searchQuery: string;
}

export class SearchResponseEvent {
  type: "SEARCH_RESPONSE";
  searchQuery: string;
  items: Product[];
}
