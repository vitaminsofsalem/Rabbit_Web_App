import { Controller, Inject } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@Controller("auth")
export class AuthController {
  constructor(@Inject("KAFKA_CLIENT") private readonly client: ClientKafka) {}
}
