import { Address } from "src/model/Address";
import {
  Order,
  OrderProductDetailed,
  OrderStatus,
  ShipmentStatus,
} from "src/model/Order";

export class GetOrdersResponseDto {
  orders: Order[];
}

export interface OrderWithShipment extends Order {
  shipmentStatus: ShipmentStatus;
}

interface DetailedOrder {
  orderId: string;
  total: number;
  deliveryFees: number;
  grandTotal: number;
  dateTime: number; //in millis
  status: OrderStatus;
  orderItems: OrderProductDetailed[];
  shipmentStatus: ShipmentStatus;
  deliveryAddress: Address;
}
export class GetOrderResponseDto {
  order: DetailedOrder;
}
