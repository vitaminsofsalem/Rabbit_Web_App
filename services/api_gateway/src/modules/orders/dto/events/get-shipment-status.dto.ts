import { Order, ShipmentStatus } from "src/model/Order";

export class GetShipmentStatusRequestEvent {
  type: "GET_STATUS_REQUEST";
  orders: string[];
}

export class GetShipmentStatusResponseEvent {
  type: "GET_STATUS_RESPONSE";
  result: { orderId: string; status: ShipmentStatus }[];
}
