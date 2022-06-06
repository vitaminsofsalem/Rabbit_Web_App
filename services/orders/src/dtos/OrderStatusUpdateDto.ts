export default class OrderStatusUpdateDto {
  type: "ORDER_STATUS_UPDATE";
  orderId: string;
  email: string;
  newStatus: string;
}
