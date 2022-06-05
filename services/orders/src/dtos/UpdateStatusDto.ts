import { IsNotEmpty, IsString } from "class-validator";

export default class UpdateStatusDto {
  type: "UPDATE_STATUS";
  orderId: any;
  status: string;
}
