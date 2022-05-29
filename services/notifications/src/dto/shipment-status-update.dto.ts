export type ShipmentStatus =
  | "CREATED"
  | "SHIPPED"
  | "DELIVERED"
  | "RETURNED"
  | "CANCELLED";

export class ShipmentStatusUpdateEvent {
  type: "SHIPMENT_STATUS_UPDATE";
  orderId: string;
  email: string;
  newStatus: ShipmentStatus;
}
