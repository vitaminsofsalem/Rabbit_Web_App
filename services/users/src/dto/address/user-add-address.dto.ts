export default class UserAddAddressEvent {
  type: "ADD_ADDRESS";
  email: string;
  address: {
    street: string;
    area: string;
    city: string;
  };
}
