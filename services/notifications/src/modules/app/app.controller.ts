import { Controller, Inject } from "@nestjs/common";
import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";
import { EmailVerificationEvent } from "src/dto/email-verification.dto";
import { OrderConfirmationEvent } from "src/dto/order-confirmation.dto";
import { OrderStatusUpdateEvent } from "src/dto/order-status-update.dto";
import { ShipmentStatusUpdateEvent } from "src/dto/shipment-status-update.dto";
import { EmailService } from "./services/email.service";

@Controller()
export class AppController {
  constructor(
    private readonly emailService: EmailService,
    @Inject("KAFKA_CLIENT") private client: ClientKafka,
  ) {}

  //Handle all events on the topic 'notification'
  //For other topics, add another function with a different @MessagePattern
  @MessagePattern("notification")
  handleNotificationMessages(@Payload("value") data: any) {
    if (data.type === "EMAIL_VERIFICATION") {
      const event = data as EmailVerificationEvent;
      this.emailService.sendVerificationEmail(event.email, event.code);
    } else if (data.type === "ORDER_CONFIRMATION") {
      const event = data as OrderConfirmationEvent;
      this.emailService.sendOrderConfirmationEmail(
        event.email,
        event.orderId,
        event.total,
        event.deliveryFees,
      );
    } else if (data.type === "ORDER_STATUS_UPDATE") {
      const event = data as OrderStatusUpdateEvent;
      this.emailService.sendOrderStatusUpdate(
        event.email,
        event.orderId,
        event.newStatus,
      );
    } else if (data.type === "SHIPMENT_STATUS_UPDATE") {
      const event = data as ShipmentStatusUpdateEvent;
      this.emailService.sendShipmentStatusUpdate(
        event.email,
        event.orderId,
        event.newStatus,
      );

      //I dont need to emit another event here but if I needed to, this is how to do it
      /*
      const newEvent: ShipmentStatusUpdateEvent = {
        type: "SHIPMENT_STATUS_UPDATE",
        email: "email@email.com",
        newStatus: "CANCELLED",
        orderId: "HGHJ-1223",
      };
      this.client.emit("notfication", newEvent); //Emits event on topic 'notification'
      */
    }
  }
}
