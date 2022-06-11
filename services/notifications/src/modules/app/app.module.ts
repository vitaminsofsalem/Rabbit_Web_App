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
            brokers: [process.env.KAFKA_BROKER],
            sasl: {
              mechanism: "plain",
              username: process.env.KAFKA_API_KEY,
              password: process.env.KAFKA_API_SECRET,
            },
            ssl: true,
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
