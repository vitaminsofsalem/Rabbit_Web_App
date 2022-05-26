import { Controller, Inject, UseGuards, Post, Body } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { UpdateShipmentStatusEvent } from "../dto/events/shipment.dto";
import { UpdateShipmentStatusRequestDto } from "../dto/shipment-status.dto";

@Controller("shipments")
export class ShipmentsController {
  constructor(@Inject("KAFKA_CLIENT") private readonly client: ClientKafka) {}

  @Post("/status")
  @UseGuards(AdminAuthGuard)
  updateShipmentStatus(@Body() body: UpdateShipmentStatusRequestDto) {
    const { orderId, shipmentStatus } = body;

    const shipmentStatusEvent: UpdateShipmentStatusEvent = {
      type: "UPDATE_STATUS",
      orderId: orderId,
      status: shipmentStatus,
    };

    this.client.emit("shipping", shipmentStatusEvent);
  }
}
