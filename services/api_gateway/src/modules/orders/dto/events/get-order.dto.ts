import { Order } from "src/model/Order";

export class GetOrdersRequestEvent {
  type: "GET_ORDERS_REQUEST";
  email: string;
}

export class GetOrdersResponseEvent {
  type: "GET_ORDERS_RESPONSE";
  email: string;
  orders: Order[];
}

export class GetOrderRequestEvent {
  type: "GET_ORDER_REQUEST";
  email: string;
  orderId: string;
}

export class GetOrderResponseEvent {
  type: "GET_ORDER_RESPONSE";
  email: string;
  order?: Order;
}
