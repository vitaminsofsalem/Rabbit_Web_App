import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";
import { SendCodeRequestDto } from "./dto/send-code.dto";
import {
  VerifyCodeRequestDto,
  VerifyCodeResponseDto,
} from "./dto/verify-code.dto";
import * as NodeCache from "node-cache";
import {
  VerifyRequestEvent,
  VerifyResponseEvent,
} from "./dto/events/verify-event.dto";
import { PendingRequestHolder } from "../../util/PendingRequestHolder";
import { SendCodeEvent } from "./dto/events/send-event.dto";
import { RequestIdGenerator } from "../../util/RequestIdGenerator";
import { AuthEventHandler } from "./AuthEventHandler";

@Controller("auth")
export class AuthController {
  constructor(
    private jwtService: JwtService,
    @Inject("KAFKA_CLIENT") private readonly client: ClientKafka,
  ) {}

  @Post("send")
  sendVerificationCode(@Body() body: SendCodeRequestDto) {
    const { email } = body;
    const sendCodeEvent: SendCodeEvent = {
      type: "AUTHENTICATE",
      email,
    };
    this.client.emit("user", sendCodeEvent);
  }

  @Post("verify")
  async verifyVerificationCode(
    @Body() body: VerifyCodeRequestDto,
  ): Promise<VerifyCodeResponseDto> {
    const { email, code } = body;

    const requestEvent: VerifyRequestEvent = {
      type: "VERIFY_REQUEST",
      email,
      code,
    };
    this.client.emit("user", requestEvent);

    const requestId = RequestIdGenerator.generateVerifyRequestId(email, code);

    const verified = await this.waitForVerifyResponse(requestId);
    if (verified) {
      const payload = { sub: email };
      return {
        verified: true,
        access_token: this.jwtService.sign(payload),
      };
    } else {
      return {
        verified: false,
      };
    }
  }
  private waitForVerifyResponse(requestId: string): Promise<boolean> {
    return PendingRequestHolder.holdConnection((complete, abort) => {
      if (AuthEventHandler.responseCache.has(requestId)) {
        const responseEvent = AuthEventHandler.responseCache.get(
          requestId,
        ) as VerifyResponseEvent;
        AuthEventHandler.responseCache.del(requestId);
        complete(responseEvent.verified);
      }
    });
  }
}
