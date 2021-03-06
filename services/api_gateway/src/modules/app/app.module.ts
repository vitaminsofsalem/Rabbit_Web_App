import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import {
  ClientProviderOptions,
  ClientsModule,
  Transport,
} from "@nestjs/microservices";
import { AuthModule } from "../auth/auth.module";
import { OrdersModule } from "../orders/order.module";
import { PaymentsModule } from "../payments/payments.module";
import { ProductsModule } from "../products/products.module";
import { UserModule } from "../user/user.module";
import { AppController } from "./app.controller";

const kafkaClient: ClientProviderOptions = {
  name: "KAFKA_CLIENT",
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: "api",
      brokers: [process.env.KAFKA_BROKER],
      sasl: {
        mechanism: "plain",
        username: process.env.KAFKA_API_KEY,
        password: process.env.KAFKA_API_SECRET,
      },
      ssl: true,
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
    AuthModule,
    OrdersModule,
    PaymentsModule,
    ProductsModule,
    UserModule,
  ],
  exports: [ClientsModule.register([kafkaClient])],
  controllers: [AppController],
})
export class AppModule {}
