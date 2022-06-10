export class CreatePaymentRequestEvent {
  type: "CREATE_PAYMENT_REQUEST";
  email: string;
  orderId: string;
  orderTotal: number;
}

export class CreatePaymentResponseEvent {
  type: "CREATE_PAYMENT_RESPONSE";
  email: string;
  orderId: string;
  orderTotal: number;
  stripeData: object;
}
