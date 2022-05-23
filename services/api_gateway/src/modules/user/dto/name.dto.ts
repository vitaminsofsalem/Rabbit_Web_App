import { MinLength } from "class-validator";

export class SetNameRequestDto {
  @MinLength(2)
  name: string;
}

export class GetNameResponseDto {
  name: string;
}
