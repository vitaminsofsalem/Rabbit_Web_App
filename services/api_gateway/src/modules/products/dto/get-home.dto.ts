import { Product } from "src/model/Product";

export class CategoryProducts {
  category: string;
  products: Product[];
}

export class GetHomeResponseDto {
  items: CategoryProducts[];
}
