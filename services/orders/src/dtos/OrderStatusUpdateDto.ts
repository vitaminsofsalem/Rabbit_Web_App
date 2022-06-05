import { IsNotEmpty, IsString } from "class-validator";

export default class OrderStatusUpdateDto {
  type: "ORDER_STATUS_UPDATE";
  orderId: any;
  email: string;
  newStatus: string;
}
