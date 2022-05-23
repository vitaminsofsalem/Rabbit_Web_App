import { CartProduct } from "src/model/Cart";

export class UpdateCartRequestDto {
  items: CartProduct[];
}

export class GetCartResponseDto {
  items: CartProduct[];
}
