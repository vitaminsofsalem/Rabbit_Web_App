import { Product } from "src/model/Product";

export class GetMetadataRequestEvent {
  type: "GET_METADATA_REQUEST";
  products: string[];
}

export class GetMetadatResponseEvent {
  type: "GET_METADATA_RESPONSE";
  products: Product[];
}
