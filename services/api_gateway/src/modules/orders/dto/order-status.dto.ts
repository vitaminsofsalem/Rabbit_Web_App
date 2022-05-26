import { IsNotEmpty } from "class-validator";
import { OrderStatus } from "src/model/Order";

export class UpdateOrderStatusRequestDto {
  @IsNotEmpty()
  orderId: string;
  @IsNotEmpty()
  orderStatus: OrderStatus;
}
