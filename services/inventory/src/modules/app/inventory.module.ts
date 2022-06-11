import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./services/inventory.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "src/schemas/product.schema";
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
            clientId: "inventory",
            brokers: [process.env.KAFKA_BROKER],
            sasl: {
              mechanism: "plain",
              username: process.env.KAFKA_API_KEY,
              password: process.env.KAFKA_API_SECRET,
            },
            ssl: true,
          },
          consumer: {
            groupId: "inevntory-consumer",
          },
        },
      },
    ]),
    MongooseModule.forRoot(
      "mongodb+srv://root:c61bRi1t5l57P3ea@rabbitcluster.kcscswy.mongodb.net/rabbit-products?retryWrites=true&w=majority",
    ),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
