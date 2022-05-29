export class VerifyPaymentEvent {
  type: "VERIFY";
  email: string;
  orderId: string;
  stripeData: object;
}
