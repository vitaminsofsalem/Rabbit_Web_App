export type OrderStatus = "PENDING" | "FULFILLED" | "CANCELLED";

export class OrderStatusUpdateEvent {
  type: "UPDATE_STATUS";
  orderId: string;
  email: string;
  newStatus: OrderStatus;
}
