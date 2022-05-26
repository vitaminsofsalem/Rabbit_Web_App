import { IsEmail } from "class-validator";

export class SendCodeRequestDto {
  @IsEmail()
  email: string;
}
