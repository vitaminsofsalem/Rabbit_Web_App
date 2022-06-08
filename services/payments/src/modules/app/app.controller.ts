import { Controller, Inject } from "@nestjs/common";
import {
  ClientKafka,
  Ctx,
  MessagePattern,
  NatsContext,
  Payload,
} from "@nestjs/microservices";
import { AppService } from "./services/app.service";
import Stripe from "stripe";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject("KAFKA_CLIENT") private client: ClientKafka,
    @Inject("STRIPE") private stripe: Stripe,
  ) {}

  //Example of handling an event on the topic: messages
  //data can be any type, as long as same as what is being sent above
  // @MessagePattern("payments")
  // handleHelloMessage(@Payload("value") data: string) {
  //   console.log("RECEIVED", data);
  // }
}
