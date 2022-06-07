import axios from "./axios";

export async function createPayment(
  orderId: string,
  orderTotal: number
): Promise<
  {
    orderId: string;
    stripeData: object;
  }[]
> {
  return (await axios.post("/payments/create", { orderId, orderTotal })).data;
}

export function verifyPayment(
  orderId: string,
  stripeData: object
): Promise<void> {
  return axios.post("/payments/verify", { orderId, stripeData });
}
