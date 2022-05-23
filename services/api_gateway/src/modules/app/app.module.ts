import { Global, Module } from "@nestjs/common";
import {
  ClientProviderOptions,
  ClientsModule,
  Transport,
} from "@nestjs/microservices";
import { AdminModule } from "../admin/admin.module";
import { AuthModule } from "../auth/auth.module";
import { PaymentsModule } from "../payments/payments.module";
import { ProductsModule } from "../products/products.module";
import { UserModule } from "../user/user.module";

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
    ClientsModule.register([kafkaClient]),
    AdminModule,
    AuthModule,
    PaymentsModule,
    ProductsModule,
    UserModule,
  ],
  exports: [ClientsModule.register([kafkaClient])],
})
export class AppModule {}
