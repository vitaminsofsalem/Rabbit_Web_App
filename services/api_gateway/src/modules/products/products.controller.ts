import { Controller, Inject } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@Controller("products")
export class ProductsController {
  constructor(@Inject("KAFKA_CLIENT") private readonly client: ClientKafka) {}
}
