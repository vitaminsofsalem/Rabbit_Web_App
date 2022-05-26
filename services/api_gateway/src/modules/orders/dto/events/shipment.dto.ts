import { ShipmentStatus } from "src/model/Order";

export class UpdateShipmentStatusEvent {
  type: "UPDATE_STATUS";
  orderId: string;
  status: ShipmentStatus;
}
