export default class ShippingUpdateStatusEvent {
  type: "UPDATE_STATUS";
  orderId: string;
  status: string;
}
