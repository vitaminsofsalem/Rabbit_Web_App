import { IsNotEmpty, IsString } from "class-validator";

export default class UserOrderDto {
  email: string;
  type: "GET_ORDER_REQUEST";
  orderId: any;
}
