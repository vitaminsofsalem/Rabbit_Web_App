import { IsNotEmpty, IsString} from "class-validator";

export default class CreateOrderDto  {

  @IsString()
  email : string;

  type: "NEW_ORDER";

  @IsNotEmpty()
  items: [];    //id of items

  @IsNotEmpty()
  address : object

   @IsNotEmpty()
  total : number

}