import { Address } from "./Address";
import { OrderCartProduct } from "./Product";

export interface Order {
  orderId: string;
  total: number;
  deliveryFees: number;
  grandTotal: number;
  dateTime: number; //in millis
  status: OrderStatus;
  shipmentStatus: ShipmentStatus;
  orderItems: OrderCartProduct[];
  deliveryAddress: Address;
}

export type OrderStatus = "PENDING" | "FULFILLED" | "CANCELED";

export type ShipmentStatus =
  | "CREATED"
  | "SHIPPED"
  | "DELIVERED"
  | "RETURNED"
  | "CANCELLED";
