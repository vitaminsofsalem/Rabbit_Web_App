import { IsNotEmpty, IsString} from "class-validator";

export default class UpdateStatusDto  {

  type: "ORDER_STATUS_UPDATE";
  orderID : any ;
  email : string;
  newStatus: "PROCESSING" | "FULFILLED" | "CANCELED"

}