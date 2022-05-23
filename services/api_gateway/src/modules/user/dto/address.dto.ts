import { IsNotEmpty } from "class-validator";
import { Address } from "src/model/Address";

export class AddAddressRequestDto {
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

export class GetAddressResponseDto {
  addresses: Address[];
}
