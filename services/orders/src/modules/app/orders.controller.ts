import { Controller, Inject } from "@nestjs/common";
import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";
import { OrdersService } from "./services/order.service";
import CreateOrderDto from "src/dtos/CreateOrderDto";
import OrderConfirmationDto from "src/dtos/OrderConfirmationDto";
import UserOrderDto from "src/dtos/UserOrderDto";
import UserOrderResponseDto from "src/dtos/UserOrderResponseDto";
import UpdateStatusDto from "src/dtos/UpdateStatusDto";
import OrderStatusUpdateDto from "src/dtos/OrderStatusUpdateDto";
import UserOrdersDto from "src/dtos/UserOrdersDto";
import UserOrdersRespDto from "src/dtos/UserOrdersRespDto";

@Controller()
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject("KAFKA_CLIENT") private client: ClientKafka,
  ) {}

  @MessagePattern("order")
  async handleOrdersMessage(@Payload("value") data: any) {
    if (data.type === "NEW_ORDER") {
      const DELIVERY_FEES = 15;
      const event = data as CreateOrderDto;
      const returnData = await this.ordersService.createOrder(
        event.email,
        event.total,
        event.address,
        event.orderItems,
      );

      const newEvent: OrderConfirmationDto = {
        type: "ORDER_CONFIRMATION",
        orderId: returnData,
        email: event.email,
        total: event.total,
        deliveryFees: DELIVERY_FEES,
      };
      this.client.emit("notification", newEvent);
    } else if (data.type === "UPDATE_STATUS") {
      const event = data as UpdateStatusDto;

      const returnData = await this.ordersService.updateStatus(
        event.orderId,
        event.newStatus,
      );

      const newEvent: OrderStatusUpdateDto = {
        type: "ORDER_STATUS_UPDATE",
        orderId: event.orderId,
        email: returnData,
        newStatus: event.newStatus,
      };
      this.client.emit("notification", newEvent);
    } else if (data.type === "GET_ORDERS_REQUEST") {
      const event = data as UserOrdersDto;
      const returnData = await this.ordersService.getUserOrders(event.email);
      const newEvent: UserOrdersRespDto = {
        type: "GET_ORDERS_RESPONSE",
        email: event.email,
        orders: returnData,
      };
      this.client.emit("order", newEvent);
    } else if (data.type === "GET_ORDER_REQUEST") {
      const event = data as UserOrderDto;
      const returnData = await this.ordersService.getUserOrder(
        event.email,
        event.orderId,
      );
      const newEvent: UserOrderResponseDto = {
        type: "GET_ORDER_RESPONSE",
        email: event.email,
        order: returnData,
        orderId: event.orderId,
      };
      this.client.emit("order", newEvent);
    }
  }
}
