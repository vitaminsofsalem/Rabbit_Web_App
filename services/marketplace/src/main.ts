import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./modules/app/products.module";

async function bootstrap() {
  const configApp = await NestFactory.create(AppModule);
  const configService = configApp.get(ConfigService);
  const KAFKA_BROKER = configService.get<string>("KAFKA_BROKER");
  const KAFKA_API_KEY = configService.get<string>("KAFKA_API_KEY");
  const KAFKA_API_SECRET = configService.get<string>("KAFKA_API_SECRET");

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: "marketplace",
          brokers: [KAFKA_BROKER],
          sasl: {
            mechanism: "plain",
            username: KAFKA_API_KEY,
            password: KAFKA_API_SECRET,
          },
          ssl: true,
        },
        consumer: {
          groupId: "marketplace-consumer",
        },
      },
    },
  );
  app.listen();
}
bootstrap();
