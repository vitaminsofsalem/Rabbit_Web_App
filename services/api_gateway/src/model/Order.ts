import { Address } from "cluster";
import { Product } from "./Product";

interface OrderProduct extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  total: number;
  deliveryFees: number;
  grandTotal: number;
  dateTime: number; //in millis
  status: string;
  products: OrderProduct[];
  deliveryAddress: Address;
}
