export default class ShippingUpdateStatusResponseEvent {
  type: "SHIPMENT_STATUS_UPDATE";
  orderId: string;
  email: string;
  newStatus: string;
}
