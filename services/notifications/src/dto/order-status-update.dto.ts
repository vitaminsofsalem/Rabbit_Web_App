export type OrderStatus = "PROCESSING" | "FULFILLED" | "CANCELED";

export class OrderStatusUpdateEvent {
  type: "ORDER_STATUS_UPDATE";
  orderId: string;
  email: string;
  newStatus: OrderStatus;
}
