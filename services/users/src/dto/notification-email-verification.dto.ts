export default class EmailVerificationEvent {
  type: "EMAIL_VERIFICATION";
  email: string;
  code: string;
}
