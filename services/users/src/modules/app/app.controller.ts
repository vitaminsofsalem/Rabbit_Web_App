import { Controller, Inject } from "@nestjs/common";
import {
  ClientKafka,
  Ctx,
  MessagePattern,
  NatsContext,
  Payload,
} from "@nestjs/microservices";
import { AppService } from "./services/app.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject("KAFKA_CLIENT") private client: ClientKafka,
  ) {
    //Examples of emiting an event for the topic: messages
    client.emit("messages", "some data");
  }

  //Example of handling an event on the topic: messages
  //data can be any type, as long as same as what is being sent above
  @MessagePattern("messages")
  handleUserMessages(@Payload("value") data: any) {
    if (data.type === "AUTHENTICATE") {
    } else if (data.type === "VERIFY_REQUEST") {
    } else if (data.type === "UPDATE_NAME") {
    } else if (data.type === "GET_NAME_REQUEST") {
    } else if (data.type === "ADD_ADDRESS") {
    } else if (data.type === "GET_ADDRESS_REQUEST") {
    } else if (data.type === "UPDATE_CART") {
    } else if (data.type === "GET_CART_REQUEST") {
    } else if (data.type === "ADD_FAVORITE") {
    } else if (data.type === "REMOVE_FAVORITE") {
    } else if (data.type === "GET_FAVORITE_REQUEST") {
    }
  }
}
