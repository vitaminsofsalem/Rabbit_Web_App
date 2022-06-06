export default class CreateOrderDto {
  type: "NEW_ORDER";

  email: string;

  total: number;

  address: {
    street: string;
    area: string;
    city: string;
  };

  orderItems: [];
}
