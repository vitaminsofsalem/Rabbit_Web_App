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
import { PendingRequestHolder } from "src/util/PendingRequestHolder";
import { RequestIdGenerator } from "src/util/RequestIdGenerator";
import { Address } from "src/model/Address";
import { AddressEventHandler } from "../event-handlers/AddressEventHandler";

@Controller("address")
export class AddressController {
  constructor(@Inject("KAFKA_CLIENT") private readonly client: ClientKafka) {}

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
  async getAddress(@Request() req: any): Promise<GetAddressResponseDto> {
    const userEmail = req.user.email as string;

    const requestEvent: GetAddressRequestEvent = {
      type: "GET_ADDRESS_REQUEST",
      email: userEmail,
    };
    const requestId = RequestIdGenerator.generateAddressRequestId(userEmail);
    this.client.emit("user", requestEvent);
    const addresses = await this.waitForAddressResponse(requestId);
    return { addresses };
  }

  private waitForAddressResponse(requestId: string): Promise<Address[]> {
    return PendingRequestHolder.holdConnection((complete, abort) => {
      if (AddressEventHandler.responseCache.has(requestId)) {
        const responseEvent = AddressEventHandler.responseCache.get(
          requestId,
        ) as GetAddressResponseEvent;
        AddressEventHandler.responseCache.del(requestId);
        complete(responseEvent.addresses);
      }
    });
  }
}
