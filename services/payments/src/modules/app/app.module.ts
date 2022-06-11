import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { StripeModule } from "../stripe.module";
import { AppController } from "./app.controller";
import { AppService } from "./services/app.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: "KAFKA_CLIENT",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "payments",
            brokers: [process.env.KAFKA_BROKER],
            sasl: {
              mechanism: "plain",
              username: process.env.KAFKA_API_KEY,
              password: process.env.KAFKA_API_SECRET,
            },
            ssl: true,
          },
          consumer: {
            groupId: "payments-consumer",
          },
        },
      },
    ]),
    StripeModule.register(
      "sk_test_51L8K7wC2xtjGi2T8TJhkGMhGqOGsoGV9fewbMQmONagThUpNyXs1Q9ASnmj0rRVWkxRvg6ppOAByrM4I2djHACdn00y7zCYX1U",
      { apiVersion: "2020-08-27" },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
