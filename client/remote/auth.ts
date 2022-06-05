import axios from "./axios";

export function sendVerificationEmail(email: string): Promise<void> {
  return axios.post("/auth/send", { email });
}

export async function verifyVerificationCode(
  email: string,
  code: string
): Promise<{
  access_token?: string;
  verified: boolean;
}> {
  return (await axios.post("/auth/verify", { email, code })).data;
}
