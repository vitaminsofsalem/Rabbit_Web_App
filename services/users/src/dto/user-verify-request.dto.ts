export default class UserVerifyRequestEvent {
  type: "VERIFY_REQUEST";
  email: string;
  code: string;
}
