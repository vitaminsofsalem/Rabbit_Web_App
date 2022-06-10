export default class UpdateStatusDto {
  type: "UPDATE_STATUS";
  orderId: string;
  newStatus: string;
}
