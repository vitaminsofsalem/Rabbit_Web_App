import { IsNotEmpty, IsString} from "class-validator";

export default class UpdateStatusDto  {

  type: "UPDATE_STATUS";
  orderID : any ;
  status: "CREATED" | "PROCESSING" | "FULFILLED" | "CANCELED"

}