import { IsDate, IsEmail, IsNotEmpty, IsString, Length } from "class-validator";


export class EventDto {

    @IsNotEmpty()
    email: string;
  
    @IsNotEmpty()
    address: string;
    
    @IsNotEmpty()
    items: string[];
  
    @IsNotEmpty()
    id: string ; 

    eventType: string;
  
  }