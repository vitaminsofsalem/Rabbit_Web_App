import { IsDate, MaxLength,IsEmail, IsNotEmpty, IsString, Length } from "class-validator";


export class EventDto {

    @IsNotEmpty()
    eventType: string;
  
  }