export type OrderStatus = "PENDING" | "FULFILLED" | "CANCELLED";

export class OrderStatusUpdateEvent {
  type: "ORDER_STATUS_UPDATE";
  orderId: string;
  email: string;
  newStatus: OrderStatus;
}
