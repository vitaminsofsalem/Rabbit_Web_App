import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ShippingController } from "./shipping.controller";
import { ShippingService } from "./services/shipping.service";
import { Shipment, ShipmentSchema } from "../../schema/shipping.schema";
import { MongooseModule } from "@nestjs/mongoose";
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
            clientId: "shipping",
            brokers: [process.env.KAFKA_BROKER],
            sasl: {
              mechanism: "plain",
              username: process.env.KAFKA_API_KEY,
              password: process.env.KAFKA_API_SECRET,
            },
            ssl: true,
          },
          consumer: {
            groupId: "shipping-consumer",
          },
        },
      },
    ]),
    MongooseModule.forRoot(
      "mongodb+srv://root:c61bRi1t5l57P3ea@rabbitcluster.kcscswy.mongodb.net/rabbit-shipping?retryWrites=true&w=majority",
    ),
    MongooseModule.forFeature([
      { name: Shipment.name, schema: ShipmentSchema },
    ]),
  ],
  controllers: [ShippingController],
  providers: [ShippingService],
})
export class AppModule {}
