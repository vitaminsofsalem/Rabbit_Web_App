import { Address } from "../model/Address";
import { Order } from "../model/Order";
import axios from "./axios";

export async function createOrder(
  address: Address,
  orderItems: { quantity: number; id: string }[],
  total: number
): Promise<{ orderId: string }> {
  return (await axios.post("/orders", { address, orderItems, total })).data;
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
