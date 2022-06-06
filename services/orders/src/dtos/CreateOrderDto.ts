import { IsNotEmpty, IsString } from "class-validator";

export default class CreateOrderDto {
  type: "NEW_ORDER";

  @IsString()
  email: string;

  @IsNotEmpty()
  total: number;

  @IsNotEmpty()
  address: {
    street: string;
    area: string;
    city: string;
  };

  @IsNotEmpty()
  orderItems: [];
}
