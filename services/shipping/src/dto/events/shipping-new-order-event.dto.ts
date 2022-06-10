export class OrderConfirmationEvent {
  type: "ORDER_CONFIRMATION";
  orderId: string;
  email: string;
  total: number;
  deliveryFees: number;
}
