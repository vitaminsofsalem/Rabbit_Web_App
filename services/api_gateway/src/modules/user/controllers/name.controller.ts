import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  Request,
  Get,
} from "@nestjs/common";
import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";
import * as NodeCache from "node-cache";
import { JwtAuthGuard } from "src/modules/auth/jwt-auth.guard";
import { GetNameResponseDto, SetNameRequestDto } from "../dto/name.dto";
import {
  UpdateNameEvent,
  GetNameRequestEvent,
  GetNameResponseEvent,
} from "../dto/events/name-event.dto";
import { PendingRequestHolder } from "src/util/PendingRequestHolder";
import { RequestIdGenerator } from "src/util/RequestIdGenerator";
import { NameEventHandler } from "../event-handlers/NameEventHandler";

@Controller("name")
export class NameController {
  constructor(@Inject("KAFKA_CLIENT") private readonly client: ClientKafka) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  setName(@Body() body: SetNameRequestDto, @Request() req: any) {
    const userEmail = req.user.email as string;
    const { name } = body;

    const updateNameEvent: UpdateNameEvent = {
      type: "UPDATE_NAME",
      name: name,
      email: userEmail,
    };

    this.client.emit("user", updateNameEvent);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getName(@Request() req: any): Promise<GetNameResponseDto> {
    const userEmail = req.user.email as string;

    const requestEvent: GetNameRequestEvent = {
      type: "GET_NAME_REQUEST",
      email: userEmail,
    };
    const requestId = RequestIdGenerator.generateNameRequestId(userEmail);
    this.client.emit("user", requestEvent);

    return { name: await this.waitForNameResponse(requestId) };
  }

  private waitForNameResponse(requestId: string): Promise<string> {
    return PendingRequestHolder.holdConnection((complete, abort) => {
      if (NameEventHandler.responseCache.has(requestId)) {
        const responseEvent = NameEventHandler.responseCache.get(
          requestId,
        ) as GetNameResponseEvent;
        NameEventHandler.responseCache.del(requestId);
        complete(responseEvent.name || "Guest");
      }
    });
  }
}
