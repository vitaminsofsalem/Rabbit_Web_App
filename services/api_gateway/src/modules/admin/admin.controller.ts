import { Controller, Inject } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@Controller("admin")
export class AdminController {
  constructor(@Inject("KAFKA_CLIENT") private readonly client: ClientKafka) {}
}
