import { Address } from "./Address";
import { OrderCartProduct } from "./Product";

export interface Order {
  id: string;
  total: number;
  deliveryFees: number;
  grandTotal: number;
  dateTime: number; //in millis
  status: OrderStatus;
  shipmentStatus: ShipmentStatus;
  products: OrderCartProduct[];
  deliveryAddress: Address;
}

export type OrderStatus = "PROCESSING" | "FULFILLED" | "CANCELED";

export type ShipmentStatus =
  | "CREATED"
  | "SHIPPED"
  | "DELIVERED"
  | "RETURNED"
  | "CANCELLED";
