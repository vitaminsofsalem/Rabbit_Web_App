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
          clientId: "shipping",
          brokers: ["localhost:9092"],
        },
        consumer: {
          groupId: "shipping-consumer",
        },
      },
    },
  );
  app.listen();
}
bootstrap();
