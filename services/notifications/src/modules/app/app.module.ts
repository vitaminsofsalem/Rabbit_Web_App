import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AppController } from "./app.controller";
import { EmailService } from "./services/email.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: "KAFKA_CLIENT",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "notifications",
            brokers: ["localhost:9092"],
          },
          consumer: {
            groupId: "notifications-consumer",
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [EmailService],
})
export class AppModule {}
