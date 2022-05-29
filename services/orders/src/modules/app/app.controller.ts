import { Controller, Inject } from "@nestjs/common";
import {
  ClientKafka,
  Ctx,
  MessagePattern,
  NatsContext,
  Payload,
} from "@nestjs/microservices";
import { OrdersService } from "./services/order.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: OrdersService,
    @Inject("KAFKA_CLIENT") private client: ClientKafka,
  ) {
    //Examples of emiting an event for the topic: messages
    client.emit("messages", "some data");
  }

  //Example of handling an event on the topic: messages
  //data can be any type, as long as same as what is being sent above
  @MessagePattern("messages")
  handleHelloMessage(@Payload("value") data: string) {
    console.log("RECEIVED", data);
  }

  
}
