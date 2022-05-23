import { Controller, Inject } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@Controller("payments")
export class PaymentsController {
  constructor(@Inject("KAFKA_CLIENT") private readonly client: ClientKafka) {}
}
