import { IsDate,MaxLength, IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { EventDto } from './event.dto';
import { PartialType } from '@nestjs/mapped-types';

export class CreateServiceDto extends PartialType(EventDto) {
    @IsNotEmpty()
    email: string;
  
    @IsNotEmpty()
    address: string;
    
    @IsNotEmpty()
    items: string[];
  
    @IsNotEmpty()
    id: string ; 

}