import { Type } from "class-transformer";
import { ArrayMinSize, IsNotEmpty, Min, ValidateNested } from "class-validator";
import { OrderProduct } from "src/model/Order";

class AddressDto {
  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  neighbourhood: string;

  @IsNotEmpty()
  street: string;

  @IsNotEmpty()
  buildingNumber: string;

  @IsNotEmpty()
  nickname: string;
}

class OrderProductDto {
  @IsNotEmpty()
  id: string;
  @Min(1)
  quantity: number;
}

export class CreateOrderRequestDto {
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => OrderProductDto)
  orderItems: OrderProductDto[];
}
