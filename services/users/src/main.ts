import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./modules/app/users.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: "users",
          brokers: ["localhost:9092"],
        },
        consumer: {
          groupId: "users-consumer",
        },
      },
    },
  );
  app.listen();
}
bootstrap();
