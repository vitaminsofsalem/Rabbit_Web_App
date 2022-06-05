import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { InventoryModule } from "./modules/app/inventory.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    InventoryModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: "inventory",
          brokers: ["localhost:9092"],
        },
        consumer: {
          groupId: "inevntory-consumer",
        },
      },
    },
  );
  app.listen();
}
bootstrap();
