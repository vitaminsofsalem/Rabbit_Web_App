import { Controller, Inject } from "@nestjs/common";
import {
  ClientKafka,
  Ctx,
  MessagePattern,
  NatsContext,
  Payload,
} from "@nestjs/microservices";
import { IngestCsvEvent } from "dto/ingest-csv.dto";
import { NewOrderEvent } from "dto/new-order.dto";

import { InventoryService } from "./services/inventory.service";

@Controller()
export class InventoryController {
  constructor(
    private readonly service: InventoryService,
    @Inject("KAFKA_CLIENT") private client: ClientKafka,
  ) {}

  @MessagePattern("products")
  handleProductEvent(@Payload("value") data: any) {
    if (data.type === "INGEST") {
      const event = data as IngestCsvEvent;
      this.service.updateInventory(event.file);
    }
  }

  @MessagePattern("order")
  handleOrderEvent(@Payload("value") data: any) {
    if (data.type === "NEW_ORDER") {
      const event = data as NewOrderEvent;
      for (const product of event.orderItems) {
        this.service.decrementItemStock(product.id, product.quantity);
      }
    }
  }
}
