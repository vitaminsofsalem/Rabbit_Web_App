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
import {
  AddAddressRequestDto,
  GetAddressResponseDto,
} from "../dto/address.dto";
import {
  AddAddressEvent,
  GetAddressRequestEvent,
  GetAddressResponseEvent,
} from "../dto/events/address-event.dto";
import { PendingRequestHolder } from "src/modules/PendingRequestHolder";

@Controller("address")
export class AddressController {
  /* responseCache: Temporarily holds "RESPONSE" events. Active HTTP connections then check cache for required response
   * Expires after 15 seconds. In which case initiater HTTP connection probably expired or fulfilled*/
  private responseCache = new NodeCache({ stdTTL: 15000 });

  constructor(@Inject("KAFKA_CLIENT") private readonly client: ClientKafka) {}

  @MessagePattern("user")
  handleUserEvents(@Payload("value") data: any) {
    if (data.type === "GET_ADDRESS_RESPONSE") {
      const event = data as GetAddressResponseEvent;
      const id = this.generateAddressRequestId(event.email);
      this.responseCache.set(id, event);
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  addAddress(@Body() body: AddAddressRequestDto, @Request() req: any) {
    const userEmail = req.user.email as string;
    const { city, buildingNumber, neighbourhood, nickname, street } = body;

    const addAddressEvent: AddAddressEvent = {
      type: "ADD_ADDRESS",
      email: userEmail,
      address: {
        city,
        buildingNumber,
        neighbourhood,
        nickname,
        street,
      },
    };

    this.client.emit("user", addAddressEvent);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAddress(@Request() req: any): Promise<GetAddressResponseDto> {
    const userEmail = req.user.email as string;

    const requestEvent: GetAddressRequestEvent = {
      type: "GET_ADDRESS_REQUEST",
      email: userEmail,
    };
    const requestId = this.generateAddressRequestId(userEmail);
    this.client.emit("user", requestEvent);

    return PendingRequestHolder.holdConnection((complete, abort) => {
      if (this.responseCache.has(requestId)) {
        const responseEvent = this.responseCache.get(
          requestId,
        ) as GetAddressResponseEvent;
        this.responseCache.del(requestId);
        complete({ addresses: responseEvent.addresses });
      }
    });
  }

  private generateAddressRequestId(email: string) {
    return `GET-ADDRESS-${email}`;
  }
}
