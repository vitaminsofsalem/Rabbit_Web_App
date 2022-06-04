import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./modules//app/app.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: "marketplace",
          brokers: ["localhost:9092"],
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
