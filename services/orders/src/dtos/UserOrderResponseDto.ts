import { IsNotEmpty, IsString} from "class-validator";

export default class UserOrderResponseDto  {

  email : string;
  order : object;
  type:"GET_ORDER_RESPONSE" ;

  
}