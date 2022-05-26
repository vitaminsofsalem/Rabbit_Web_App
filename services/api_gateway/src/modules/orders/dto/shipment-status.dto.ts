import { IsNotEmpty } from "class-validator";
import { ShipmentStatus } from "src/model/Order";

export class UpdateShipmentStatusRequestDto {
  @IsNotEmpty()
  orderId: string;
  @IsNotEmpty()
  shipmentStatus: ShipmentStatus;
}
