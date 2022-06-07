import { Address } from "cluster";
import { Order } from "../model/Order";
import axios from "./axios";

export function createOrder(
  address: Address,
  orderItems: { quantity: number; id: string }[],
  total: number
): Promise<void> {
  return axios.post("/orders", { address, orderItems, total });
}

export async function getOrders(): Promise<{
  orders: Order[];
}> {
  return (await axios.get("/orders")).data;
}

export async function getOrder(orderId: string): Promise<{
  order: Order;
}> {
  return (await axios.get("/orders/" + orderId)).data;
}
