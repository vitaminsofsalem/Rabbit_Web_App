import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./modules/app/orders.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: "orders",
          brokers: ["localhost:9092"],
        },
        consumer: {
          groupId: "orders-consumer",
        },
      },
    },
  );
  app.listen();
}
bootstrap();
