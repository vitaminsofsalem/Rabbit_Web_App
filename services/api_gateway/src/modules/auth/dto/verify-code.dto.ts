import { IsEmail, Length } from "class-validator";

export class VerifyCodeRequestDto {
  @IsEmail()
  email: string;

  @Length(6)
  code: string;
}

export class VerifyCodeResponseDto {
  access_token?: string;
  verified: boolean;
}
