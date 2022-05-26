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
  id: string;
  total: number;
  deliveryFees: number;
  grandTotal: number;
  dateTime: number; //in millis
  status: OrderStatus;
  products: OrderProduct[];
  deliveryAddress: Address;
}

export type OrderStatus = "PROCESSING" | "FULFILLED" | "CANCELED";

export type ShipmentStatus =
  | "CREATED"
  | "SHIPPED"
  | "DELIVERED"
  | "RETURNED"
  | "CANCELLED";
