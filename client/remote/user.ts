import { Address } from "../model/Address";
import { OrderCartProduct, Product } from "../model/Product";
import axios from "./axios";

export function updateName(name: string): Promise<void> {
  return axios.post("/name", { name });
}

export async function getName(): Promise<string> {
  return (await axios.get("/name")).data.name;
}

export async function getAddresses(): Promise<{ addresses: Address[] }> {
  return (await axios.get("/address")).data;
}

export async function addAddress(address: Address): Promise<void> {
  return await axios.post("/address", address);
}

export async function deleteAddress(address: Address): Promise<void> {
  return await axios.delete("/address", { data: { address } });
}

export async function getCart(): Promise<{
  cart: OrderCartProduct[];
}> {
  return (await axios.get("/cart")).data;
}

export async function updateCart(
  cart: { quantity: number; id: string }[]
): Promise<void> {
  return await axios.post("/cart", { cart });
}

export async function addFavorite(productId: string): Promise<void> {
  return await axios.post("/favorite", { productId });
}

export async function deleteFavorite(productId: string): Promise<void> {
  return await axios.delete("/favorite", { data: { productId } });
}

export async function getFavorites(): Promise<{
  favorites: Product[];
}> {
  return (await axios.get("/favorite")).data;
}
