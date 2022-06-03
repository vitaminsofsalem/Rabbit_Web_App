import { IsNotEmpty, IsString} from "class-validator";

export default class GettingOrderDto  {

  email : string;
  type: "GET_ORDERS_RESPONSE";
  order : []

}