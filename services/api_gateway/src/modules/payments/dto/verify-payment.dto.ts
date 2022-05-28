import { IsNotEmpty, IsNotEmptyObject } from "class-validator";

export class VerifyPaymentRequestDto {
  @IsNotEmpty()
  orderId: string;
  @IsNotEmptyObject()
  stripeData: object;
}
