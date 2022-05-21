import { IsDate, IsEmail, IsNotEmpty, IsString, Length } from "class-validator";


export class registerDto {

    @IsNotEmpty()
    email: string;
  
    @IsNotEmpty()
    address: string;
    
    @IsNotEmpty()
    items: string[];
  
    @IsNotEmpty()
    id: string ; 
  
  }