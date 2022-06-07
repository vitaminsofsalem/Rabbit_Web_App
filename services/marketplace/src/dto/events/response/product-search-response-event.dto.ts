export default class ProductSearchResponseEvent {
  type: "SEARCH_RESPONSE";
  searchQuery: string;
  items: any[];
}
