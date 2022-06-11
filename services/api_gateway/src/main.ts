import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./modules/app/app.module";
import { ConfigService } from "@nestjs/config";

//Hybrid app, supports both HTTP & Kafka. Only Api gateway should be hybrid
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const KAFKA_BROKER = configService.get<string>("KAFKA_BROKER");
  const KAFKA_API_KEY = configService.get<string>("KAFKA_API_KEY");
  const KAFKA_API_SECRET = configService.get<string>("KAFKA_API_SECRET");

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: "api",
        brokers: [KAFKA_BROKER],
        sasl: {
          mechanism: "plain",
          username: KAFKA_API_KEY,
          password: KAFKA_API_SECRET,
        },
        ssl: true,
      },
      consumer: {
        groupId: "api-consumer",
      },
    },
  });
  await app.startAllMicroservices();
  app.enableCors({ origin: "http://localhost:3000" });
  await app.listen(3001);
}
bootstrap();
