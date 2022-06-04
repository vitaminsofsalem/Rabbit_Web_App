import { IsNotEmpty, IsString} from "class-validator";

export default class OrderStatusUpdateDto  {

  type: "ORDER_STATUS_UPDATE";
  orderID : any ;
  email : string;
  newStatus: string

}