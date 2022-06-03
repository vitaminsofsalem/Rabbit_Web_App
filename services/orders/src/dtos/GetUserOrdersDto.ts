import { IsNotEmpty, IsString} from "class-validator";

export default class GetUserOrdersDto  {

  email : string;
  type: "GET_ORDERS_REQUEST";
}