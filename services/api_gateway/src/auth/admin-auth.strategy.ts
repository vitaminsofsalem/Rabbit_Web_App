import { HeaderAPIKeyStrategy } from "passport-headerapikey";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AdminAuthStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  "admin",
) {
  constructor() {
    super(
      { header: "X-ADMIN-KEY", prefix: "" },
      true,
      (key: string, done: (...arg: any[]) => void) => {
        done(null, key === process.env.ADMIN_KEY);
      },
    );
  }
}
