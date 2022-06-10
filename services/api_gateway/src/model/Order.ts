import { Address } from "./Address";
import { Product } from "./Product";

export interface OrderProduct {
  id: string;
  quantity: number;
}

export interface OrderProductDetailed extends Product {
  quantity: number;
}

export interface Order {
  orderId: string;
  total: number;
  deliveryFees: number;
  grandTotal: number;
  dateTime: number; //in millis
  status: OrderStatus;
  orderItems: OrderProduct[];
  deliveryAddress: Address;
}

export type OrderStatus = "PENDING" | "FULFILLED" | "CANCELED";

export type ShipmentStatus =
  | "CREATED"
  | "SHIPPED"
  | "DELIVERED"
  | "RETURNED"
  | "CANCELLED";
