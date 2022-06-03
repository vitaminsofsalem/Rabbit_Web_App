export default class UserVerifyResponseEvent {
  type: "VERIFY_RESPONSE";
  email: string;
  code: string;
  verified: boolean;
}
