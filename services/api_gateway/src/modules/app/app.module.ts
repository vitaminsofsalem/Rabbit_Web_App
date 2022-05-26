import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import {
  ClientProviderOptions,
  ClientsModule,
  Transport,
} from "@nestjs/microservices";
import { PassportModule } from "@nestjs/passport";
import { OrdersController } from "src/orders/controllers/orders.controller";
import { ShipmentsController } from "src/orders/controllers/shipment.controller";
import { PaymentsController } from "src/payments/payments.controller";
import { ProductsController } from "src/products/products.controller";
import { AddressController } from "src/user/controllers/address.controller";
import { CartController } from "src/user/controllers/cart.controller";
import { FavoritesController } from "src/user/controllers/favorites.controller";
import { NameController } from "src/user/controllers/name.controller";
import { AdminAuthStrategy } from "../../auth/admin-auth.strategy";
import { AuthController } from "../../auth/auth.controller";
import { JwtStrategy } from "../../auth/jwt.strategy";

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
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([kafkaClient]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "30d" },
    }),
  ],
  exports: [ClientsModule.register([kafkaClient])],
  controllers: [
    AuthController,
    AddressController,
    CartController,
    FavoritesController,
    NameController,
    ProductsController,
    PaymentsController,
    OrdersController,
    ShipmentsController,
  ],
  providers: [JwtStrategy, AdminAuthStrategy],
})
export class AppModule {}
