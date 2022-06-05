import { IsNotEmpty, IsString } from "class-validator";

export default class UserOrdersDto {
  email: string;
  type: "GET_ORDERS_REQUEST";
}
