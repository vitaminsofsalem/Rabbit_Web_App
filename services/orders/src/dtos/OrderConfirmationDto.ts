import { IsNotEmpty, IsString } from "class-validator";

export default class OrderConfirmationDto {
  email: string;
  type: "ORDER_CONFIRMATION";
  total: number;
  deliveryFees: number;
  orderId: string;
}
