import { Product } from "../model/Product";
import axios from "./axios";

export async function getHomeProducts(): Promise<{
  items: {
    category: string;
    products: Product[];
  }[];
}> {
  return (await axios.get("/products/home")).data;
}

export async function getCategories(): Promise<{
  categories: string[];
}> {
  return (await axios.get("/products/categories")).data;
}

export async function getCategoryProducts(category: string): Promise<{
  products: Product[];
}> {
  return (await axios.get("/products/categories/" + category)).data;
}

export async function searchProducts(query: string): Promise<{
  products: Product[];
}> {
  return (await axios.get("/products/search", { params: { query } })).data;
}

export async function getProductDetails(productId: string): Promise<{
  product: Product;
}> {
  return (await axios.get("/products/" + productId)).data;
}
