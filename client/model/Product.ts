export interface Product {
  id: string;
  name: string;
  price: number;
  subtext: string;
  imageUrl: string;
  currentQuantity : number;
}

export interface OrderCartProduct extends Product {
  quantity: number;
}
