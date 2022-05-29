import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";

@Module({
  imports: [],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
