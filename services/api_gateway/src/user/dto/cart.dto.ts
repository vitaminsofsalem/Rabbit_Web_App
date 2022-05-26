import { IsArray } from "class-validator";
import { CartProduct } from "src/model/Cart";

export class UpdateCartRequestDto {
  @IsArray()
  cart: CartProduct[];
}

export class GetCartResponseDto {
  cart: CartProduct[];
}
