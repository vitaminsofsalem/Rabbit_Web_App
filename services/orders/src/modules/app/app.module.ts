import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AppController } from "./app.controller";
import { OrdersService } from "./services/order.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "KAFKA_CLIENT",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "orders",
            brokers: ["localhost:9092"],
          },
          consumer: {
            groupId: "orders-consumer",
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [OrdersService],
})
export class AppModule {}
