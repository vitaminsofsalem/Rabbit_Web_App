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
import { PendingRequestHolder } from "src/modules/PendingRequestHolder";

@Controller("name")
export class NameController {
  /* responseCache: Temporarily holds "RESPONSE" events. Active HTTP connections then check cache for required response
   * Expires after 15 seconds. In which case initiater HTTP connection probably expired or fulfilled*/
  private responseCache = new NodeCache({ stdTTL: 15000 });

  constructor(@Inject("KAFKA_CLIENT") private readonly client: ClientKafka) {}

  @MessagePattern("user")
  handleUserEvents(@Payload("value") data: any) {
    if (data.type === "GET_NAME_RESPONSE") {
      const event = data as GetNameResponseEvent;
      const id = this.generateNameRequestId(event.email);
      this.responseCache.set(id, event);
    }
  }

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
  getName(@Request() req: any): Promise<GetNameResponseDto> {
    const userEmail = req.user.email as string;

    const requestEvent: GetNameRequestEvent = {
      type: "GET_NAME_REQUEST",
      email: userEmail,
    };
    const requestId = this.generateNameRequestId(userEmail);
    this.client.emit("user", requestEvent);

    return PendingRequestHolder.holdConnection((complete, abort) => {
      if (this.responseCache.has(requestId)) {
        const responseEvent = this.responseCache.get(
          requestId,
        ) as GetNameResponseEvent;
        this.responseCache.del(requestId);
        complete({ name: responseEvent.name || "Guest" });
      }
    });
  }

  private generateNameRequestId(email: string) {
    return `GET-NAME-${email}`;
  }
}
