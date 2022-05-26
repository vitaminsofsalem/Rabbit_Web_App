import { Global, Module } from "@nestjs/common";
import {
  ClientProviderOptions,
  ClientsModule,
  Transport,
} from "@nestjs/microservices";
import { AuthModule } from "src/modules/auth/auth.module";
import { OrdersController } from "src/orders/controllers/orders.controller";
import { ShipmentsController } from "src/orders/controllers/shipment.controller";
import { PaymentsController } from "src/payments/payments.controller";
import { ProductsController } from "src/products/products.controller";
import { AddressController } from "src/user/controllers/address.controller";
import { CartController } from "src/user/controllers/cart.controller";
import { FavoritesController } from "src/user/controllers/favorites.controller";
import { NameController } from "src/user/controllers/name.controller";

const kafkaClient: ClientProviderOptions = {
  name: "KAFKA_CLIENT",
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: "api",
      brokers: ["localhost:9092"],
    },
    consumer: {
      groupId: "api-consumer",
    },
  },
};

@Global()
@Module({
  imports: [ClientsModule.register([kafkaClient]), AuthModule],
  exports: [ClientsModule.register([kafkaClient])],
  controllers: [
    AddressController,
    CartController,
    FavoritesController,
    NameController,
    ProductsController,
    PaymentsController,
    OrdersController,
    ShipmentsController,
  ],
})
export class AppModule {}
