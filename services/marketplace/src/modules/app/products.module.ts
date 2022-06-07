import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./services/products.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "src/schema/products.schema";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "KAFKA_CLIENT",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "marketplace",
            brokers: ["localhost:9092"],
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
