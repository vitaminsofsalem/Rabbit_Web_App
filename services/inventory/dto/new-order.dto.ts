export class NewOrderEvent {
  type: "NEW_ORDER";
  orderItems: {
    id: string;
    quantity: number;
  }[];
}
