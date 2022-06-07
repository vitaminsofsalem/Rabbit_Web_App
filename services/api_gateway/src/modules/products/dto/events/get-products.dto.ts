import { Product } from "src/model/Product";

export class GetProductsRequestEvent {
  type: "GET_PRODUCTS_REQUEST";
  filter: object;
}

export class GetProductsResponseEvent {
  type: "GET_PRODUCTS_RESPONSE";
  filter: object;
  items: Product[];
}
