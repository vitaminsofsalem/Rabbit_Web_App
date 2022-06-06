export default class ShippingNewOrderEvent {
  type: "NEW_ORDER";
  email: string;
  address: {
    street: string;
    area: string;
    city: string;
  };
  order: {
    orderId: string;
    status: string;
  };
}
