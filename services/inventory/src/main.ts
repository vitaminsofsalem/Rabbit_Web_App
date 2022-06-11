import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { InventoryModule } from "./modules/app/inventory.module";

async function bootstrap() {
  const configApp = await NestFactory.create(InventoryModule);
  const configService = configApp.get(ConfigService);
  const KAFKA_BROKER = configService.get<string>("KAFKA_BROKER");
  const KAFKA_API_KEY = configService.get<string>("KAFKA_API_KEY");
  const KAFKA_API_SECRET = configService.get<string>("KAFKA_API_SECRET");

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    InventoryModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: "inventory",
          brokers: [KAFKA_BROKER],
          sasl: {
            mechanism: "plain",
            username: KAFKA_API_KEY,
            password: KAFKA_API_SECRET,
          },
          ssl: true,
        },
        consumer: {
          groupId: "inventory-consumer",
        },
      },
    },
  );

  app.listen();
}
bootstrap();
