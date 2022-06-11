import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./services/products.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "src/schema/products.schema";
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
            clientId: "marketplace",
            brokers: [process.env.KAFKA_BROKER],
            sasl: {
              mechanism: "plain",
              username: process.env.KAFKA_API_KEY,
              password: process.env.KAFKA_API_SECRET,
            },
            ssl: true,
          },
          consumer: {
            groupId: "marketplace-consumer",
          },
        },
      },
    ]),
    MongooseModule.forRoot(
      "mongodb+srv://root:c61bRi1t5l57P3ea@rabbitcluster.kcscswy.mongodb.net/rabbit-products?retryWrites=true&w=majority",
    ),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class AppModule {}
