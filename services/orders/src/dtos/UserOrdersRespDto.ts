import { IsNotEmpty, IsString } from "class-validator";

export default class UserOrdersRespDto {
  email: string;
  type: "GET_ORDERS_RESPONSE";
  orders: [];
}
