import { Controller, Inject } from "@nestjs/common";
import {
  ClientKafka,
  Ctx,
  MessagePattern,
  NatsContext,
  Payload,
} from "@nestjs/microservices";
import { InventoryService } from "./services/inventory.service";

@Controller()
export class InventoryController {
  constructor(
    private readonly appService: InventoryService,
    @Inject("KAFKA_CLIENT") private client: ClientKafka,
  ) {}
}
