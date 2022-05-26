export class VerifyRequestEvent {
  type: "VERIFY_REQUEST";
  email: string;
  code: string;
}

export class VerifyResponseEvent {
  type: "VERIFY_RESPONSE";
  email: string;
  code: string;
  verified: boolean;
}
