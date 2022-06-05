import { Controller, Inject } from "@nestjs/common";
import {
  ClientKafka,
  Ctx,
  MessagePattern,
  NatsContext,
  Payload,
} from "@nestjs/microservices";
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
export class AppController {
  constructor(
    private readonly OrdersService: OrdersService,
    @Inject("KAFKA_CLIENT") private client: ClientKafka,
  ) {}

  @MessagePattern("orders")
  async handleOrdersMessage(@Payload("value") data: any) {
    if (data.type === "NEW_ORDER") {
      const event = data as CreateOrderDto;
      const returnData = await this.OrdersService.createOrder(
        event.email,
        event.orderItems,
        event.address,
        event.total,
      );
      if (returnData) {
        const newEvent: OrderConfirmationDto = {
          type: "ORDER_CONFIRMATION",
          deliveryFees: 10,
          email: event.email,
          total: event.total,
          orderId: returnData,
        };
        this.client.emit("notification", newEvent);
      }
    } else if (data.type === "GET_ORDER_REQUEST") {
      const event = data as UserOrderDto;
      const returnData = await this.OrdersService.getUserOrder(
        event.email,
        event.orderId,
      );
      const newEvent: UserOrderResponseDto = {
        email: event.email,
        type: "GET_ORDER_RESPONSE",
        order: returnData,
      };
      this.client.emit("orders", newEvent);
    } else if (data.type === "GET_ORDERS_REQUEST") {
      const event = data as UserOrdersDto;
      const returnData = await this.OrdersService.getUserOrders(event.email);
      const newEvent: UserOrdersRespDto = {
        email: event.email,
        type: "GET_ORDERS_RESPONSE",
        orders: returnData as [],
      };
      this.client.emit("orders", newEvent);
    } else if (data.type === "UPDATE_STATUS") {
      const event = data as UpdateStatusDto;
      const returnData = await this.OrdersService.updateStatus(
        event.status,
        event.orderId,
      );
      const newEvent: OrderStatusUpdateDto = {
        orderId: event.orderId,
        newStatus: event.status,
        type: "ORDER_STATUS_UPDATE",
        email: returnData,
      };
      this.client.emit("notification", newEvent);
    }
  }
}
