import { CartProduct } from "src/model/Cart";

export class GetCartRequestEvent {
  type: "GET_CART_REQUEST";
  email: string;
}

export class GetCartResponseEvent {
  type: "GET_CART_RESPONSE";
  email: string;
  cart: CartProduct[];
}

export class UpdateCartEvent {
  type: "UPDATE_CART";
  email: string;
  cart: CartProduct[];
}
