import { Controller, Inject } from "@nestjs/common";
import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";
import ShippingGetStatusRequestEvent from "src/dto/events/shipping-get-status-request-event.dto";
import ShippingGetStatusResponseEvent from "src/dto/events/shipping-get-status-response-event.dto";
import ShippingNewOrderEvent from "src/dto/events/shipping-new-order-event.dto";
import ShippingUpdateStatusEvent from "src/dto/events/shipping-update-status-event.dto";
import ShippingUpdateStatusResponseEvent from "src/dto/events/shipping-update-status-response-event.dto";
import { ShippingService } from "./services/shipping.service";

@Controller()
export class ShippingController {
  constructor(
    private readonly shippingService: ShippingService,
    @Inject("KAFKA_CLIENT") private client: ClientKafka,
  ) {
    //Examples of emiting an event for the topic: messages
    client.emit("messages", "some data");
  }

  //Example of handling an event on the topic: messages
  //data can be any type, as long as same as what is being sent above
  @MessagePattern("shipping")
  async handleShippingMessages(@Payload("value") data: any) {
    if (data.type === "NEW_ORDER") {
      const event = data as ShippingNewOrderEvent;
      const result = await this.shippingService.createShipping(
        event.email,
        event.address,
        event.order,
      );
      return result;
    } else if (data.type === "UPDATE_STATUS") {
      const event = data as ShippingUpdateStatusEvent;
      const { email } = await this.shippingService.updateStatus(
        event.orderId,
        event.status,
      );

      const newEvent: ShippingUpdateStatusResponseEvent = {
        type: "SHIPMENT_STATUS_UPDATE",
        orderId: event.orderId,
        email,
        newStatus: event.status,
      };

      this.client.emit("notification", newEvent);
    } else if (data.type === "GET_STATUS_REQUEST") {
      const event = data as ShippingGetStatusRequestEvent;
      const result = await this.shippingService.getStatus(event.orders);

      const newEvent: ShippingGetStatusResponseEvent = {
        type: "GET_STATUS_RESPONSE",
        result,
      };

      this.client.emit("shipping", newEvent);
    }
  }
}
