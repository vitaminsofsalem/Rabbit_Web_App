import { IsNotEmpty } from "class-validator";
import { Product } from "src/model/Product";

export class EditFavoriteRequestDto {
  @IsNotEmpty()
  productId: string;
}

export class GetFavoriteResponseDto {
  favorites: Product[];
}
