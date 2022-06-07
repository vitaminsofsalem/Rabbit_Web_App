export default class UserOrderResponseDto {
  type: "GET_ORDER_RESPONSE";
  email: string;
  order: object;
  orderId: string;
}
