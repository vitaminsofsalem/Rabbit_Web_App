export default class UserGetNameResponseEvent {
  type: "GET_NAME_RESPONSE";
  email: string;
  name: string | undefined;
}
