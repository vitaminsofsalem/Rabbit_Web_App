export interface Product {
  id: string;
  name: string;
  price: number;
  subtext: string;
  imageUrl: string;
}

export interface OrderCartProduct extends Product {
  quantity: number;
}
