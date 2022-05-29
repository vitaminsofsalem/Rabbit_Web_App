import { Module } from "@nestjs/common";
import { OrdersController } from "./controllers/orders.controller";
import { ShipmentsController } from "./controllers/shipment.controller";

@Module({
  imports: [],
  controllers: [OrdersController, ShipmentsController],
})
export class OrdersModule {}
