export default class OrderConfirmationDto {
  type: "ORDER_CONFIRMATION";
  orderId: string;
  email: string;
  total: number;
  deliveryFees: number;
}
