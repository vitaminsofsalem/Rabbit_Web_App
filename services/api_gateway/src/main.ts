import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./modules/app/app.module";

//Hybrid app, supports both HTTP & Kafka. Only Api gateway should be hybrid
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ["localhost:9092"],
      },
    },
  });
  await app.startAllMicroservices();
  app.enableCors({ origin: "http://localhost:3000" });
  await app.listen(3001);
}
bootstrap();
