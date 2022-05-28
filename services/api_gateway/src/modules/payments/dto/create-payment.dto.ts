import { IsNotEmpty, Min } from "class-validator";

export class CreatePaymentRequestDto {
  @IsNotEmpty()
  orderId: string;
  @Min(1)
  orderTotal: number;
}

export class CreatePaymentResponseDto {
  orderId: string;
  stripeData: object;
}
