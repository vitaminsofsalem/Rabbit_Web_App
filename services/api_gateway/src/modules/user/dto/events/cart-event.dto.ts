export class GetCartRequestEvent {
  type: "GET_CART_REQUEST";
  email: string;
}

export class GetCartResponseEvent {
  type: "GET_CART_RESPONSE";
  email: string;
  cart: string[];
}

export class UpdateCartEvent {
  type: "UPDATE_CART";
  email: string;
  cart: string[];
}
