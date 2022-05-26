import { Address } from "src/model/Address";

export class AddAddressEvent {
  type: "ADD_ADDRESS";
  email: string;
  address: Address;
}

export class GetAddressRequestEvent {
  type: "GET_ADDRESS_REQUEST";
  email: string;
}

export class GetAddressResponseEvent {
  type: "GET_ADDRESS_RESPONSE";
  email: string;
  addresses: Address[];
}
