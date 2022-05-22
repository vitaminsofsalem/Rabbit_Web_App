import { Controller, Inject } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@Controller("user")
export class UserController {
  constructor(@Inject("KAFKA_CLIENT") private readonly client: ClientKafka) {}
}
