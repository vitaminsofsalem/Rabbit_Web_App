import { Product } from "src/model/Product";

export class GetProductsResponseDto {
  products: Product[];
}

export class GetProductDetailsDto {
  product: Product;
}
