export class UpdateNameEvent {
  type: "UPDATE_NAME";
  email: string;
  name: string;
}

export class GetNameRequestEvent {
  type: "GET_NAME_REQUEST";
  email: string;
}

export class GetNameResponseEvent {
  type: "GET_NAME_RESPONSE";
  email: string;
  name?: string;
}
