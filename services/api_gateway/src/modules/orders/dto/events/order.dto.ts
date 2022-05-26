import { Address } from "src/model/Address";
import { OrderProduct, OrderStatus } from "src/model/Order";

export class NewOrderEvent {
  type: "NEW_ORDER";
  email: string;
  address: Address;
  orderItems: OrderProduct[];
}

export class UpdateOrderStatusEvent {
  type: "UPDATE_STATUS";
  orderId: string;
  status: OrderStatus;
}
