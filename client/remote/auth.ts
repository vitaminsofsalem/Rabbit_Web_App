import axios from "./axios";

export function sendVerificationEmail(email: string): Promise<void> {
  return axios.post("/auth/send", { email });
}

export function verifyVerificationCode(
  email: string,
  code: string
): Promise<{
  access_token?: string;
  verified: boolean;
}> {
  return axios.post("/auth/verify", { email, code });
}

export function updateName(name: string): Promise<void> {
  return axios.post("/name", { name });
}
