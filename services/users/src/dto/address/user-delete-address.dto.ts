export class UserDeleteAddressEvent {
  type: "DELETE_ADDRESS";
  email: string;
  address: object;
}
