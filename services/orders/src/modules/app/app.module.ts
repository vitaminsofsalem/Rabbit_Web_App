import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AppController } from "./app.controller";
import { OrdersService } from "./services/order.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Orders, OrdersSchema } from "src/schemas/order.schema";
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
     MongooseModule.forRoot(
      "mongodb+srv://root:c61bRi1t5l57P3ea@rabbitcluster.kcscswy.mongodb.net/rabbit-orders?retryWrites=true&w=majority",
    ),
    MongooseModule.forFeature([
      { name: Orders.name, schema: OrdersSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [OrdersService],
})
export class AppModule {}
