import {
  Controller,
  Inject,
  UseGuards,
  Request,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";
import * as NodeCache from "node-cache";
import { Order, OrderProductDetailed, ShipmentStatus } from "src/model/Order";
import { AdminAuthGuard } from "src/modules/auth/admin-auth.guard";
import { JwtAuthGuard } from "src/modules/auth/jwt-auth.guard";
import {
  GetMetadataRequestEvent,
  GetMetadatResponseEvent,
} from "../../user/dto/events/metadata-event";
import { PendingRequestHolder } from "src/util/PendingRequestHolder";
import { RequestIdGenerator } from "src/util/RequestIdGenerator";
import {
  CreateOrderRequestDto,
  CreateOrderResponseDto,
} from "../dto/create-order.dto";
import {
  GetOrderRequestEvent,
  GetOrderResponseEvent,
  GetOrdersRequestEvent,
  GetOrdersResponseEvent,
} from "../dto/events/get-order.dto";
import {
  GetShipmentStatusRequestEvent,
  GetShipmentStatusResponseEvent,
} from "../dto/events/get-shipment-status.dto";
import { NewOrderEvent, UpdateOrderStatusEvent } from "../dto/events/order.dto";
import {
  GetOrderResponseDto,
  GetOrdersResponseDto,
  OrderWithShipment,
} from "../dto/get-order";
import { UpdateOrderStatusRequestDto } from "../dto/order-status.dto";
import { Product } from "src/model/Product";
import { OrdersEventHandler } from "../event_handlers/OrdersEventHandler";
import { OrderConfirmationEvent } from "../dto/events/order-confirmation.dto";

@Controller("orders")
export class OrdersController {
  constructor(@Inject("KAFKA_CLIENT") private readonly client: ClientKafka) {}

  @Post("/status")
  @UseGuards(AdminAuthGuard)
  updateOrderStatus(@Body() body: UpdateOrderStatusRequestDto) {
    const { orderId, orderStatus } = body;

    const orderStatusEvent: UpdateOrderStatusEvent = {
      type: "UPDATE_STATUS",
      orderId: orderId,
      status: orderStatus,
    };

    this.client.emit("order", orderStatusEvent);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Body() body: CreateOrderRequestDto,
    @Request() req: any,
  ): Promise<CreateOrderResponseDto> {
    const userEmail = req.user.email as string;
    const { address, orderItems, total } = body;

    const newOrderEvent: NewOrderEvent = {
      type: "NEW_ORDER",
      email: userEmail,
      address,
      orderItems,
      total,
    };

    this.client.emit("order", newOrderEvent);
    const requestId = RequestIdGenerator.generateCreateOrderRequestId(
      userEmail,
      total,
    );
    const orderId = await this.waitForOrderConfirmation(requestId);
    return { orderId };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getOrders(@Request() req: any): Promise<GetOrdersResponseDto> {
    const userEmail = req.user.email as string;

    const requestEvent: GetOrdersRequestEvent = {
      type: "GET_ORDERS_REQUEST",
      email: userEmail,
    };
    this.client.emit("order", requestEvent);
    const requestId = RequestIdGenerator.generateOrdersRequestId(userEmail);

    const orders = await this.waitForOrdersResponse(requestId);

    const orderIds = orders.map((item) => item.orderId);
    const requestShipmentStatusEvent: GetShipmentStatusRequestEvent = {
      type: "GET_STATUS_REQUEST",
      orders: orderIds,
    };

    this.client.emit("shipping", requestShipmentStatusEvent);
    const shipmentStatusId =
      RequestIdGenerator.generateOrderShipmentStatusRquestId(orderIds);

    const shipmentStatuses = await this.waitForShipmentStatuses(
      shipmentStatusId,
    );

    const ordersWithShipmentStatus = orders.map((order) => {
      const statusItem = shipmentStatuses.find(
        (item) => item.orderId === order.orderId,
      );

      const grandTotal = order.total + 15;

      return {
        ...order,
        shipmentStatus: statusItem.status,
        grandTotal,
        deliveryFees: 15,
      };
    });

    return { orders: ordersWithShipmentStatus };
  }

  @Get("/:id")
  @UseGuards(JwtAuthGuard)
  async getOrder(
    @Request() req: any,
    @Param("id") id: string,
  ): Promise<GetOrderResponseDto> {
    const userEmail = req.user.email as string;

    const requestEvent: GetOrderRequestEvent = {
      type: "GET_ORDER_REQUEST",
      email: userEmail,
      orderId: id,
    };
    const requestId = RequestIdGenerator.generateOrderRequestId(userEmail, id);
    this.client.emit("order", requestEvent);

    const order = await this.waitForOrderResponse(requestId);
    if (!order) {
      throw new HttpException("No order for given id", HttpStatus.NOT_FOUND);
    }

    const requestShipmentStatusEvent: GetShipmentStatusRequestEvent = {
      type: "GET_STATUS_REQUEST",
      orders: [order.orderId],
    };

    this.client.emit("shipping", requestShipmentStatusEvent);
    const shipmentStatusId =
      RequestIdGenerator.generateOrderShipmentStatusRquestId([order.orderId]);

    const orderProducts = order.orderItems.map((item) => item.id);
    const metaDataRequestId = this.sendGetMetaDataRequestEvent(orderProducts);

    const shipmentStatus = await this.waitForShipmentStatuses(shipmentStatusId);

    const metaData = await this.waitForMetaDataResponse(metaDataRequestId);

    const detailedProducts: OrderProductDetailed[] = [];
    for (const item of order.orderItems) {
      const correspondingMetaData = metaData.find(
        (meta) => meta.id === item.id,
      );
      detailedProducts.push({ ...item, ...correspondingMetaData });
    }
    const grandTotal = order.total + 15;

    return {
      order: {
        ...order,
        shipmentStatus: shipmentStatus[0].status,
        orderItems: detailedProducts,
        grandTotal,
        deliveryFees: 15,
      },
    };
  }

  private waitForOrdersResponse(requestId: string): Promise<Order[]> {
    return PendingRequestHolder.holdConnection<Order[]>((complete, abort) => {
      if (OrdersEventHandler.responseCache.has(requestId)) {
        const responseEvent = OrdersEventHandler.responseCache.get(
          requestId,
        ) as GetOrdersResponseEvent;
        OrdersEventHandler.responseCache.del(requestId);
        complete(responseEvent.orders);
      }
    });
  }

  private waitForOrderResponse(requestId: string): Promise<Order> {
    return PendingRequestHolder.holdConnection<Order | null>(
      (complete, abort) => {
        if (OrdersEventHandler.responseCache.has(requestId)) {
          const responseEvent = OrdersEventHandler.responseCache.get(
            requestId,
          ) as GetOrderResponseEvent;
          OrdersEventHandler.responseCache.del(requestId);
          complete(responseEvent.order);
        }
      },
    );
  }

  private waitForOrderConfirmation(requestId: string): Promise<string> {
    return PendingRequestHolder.holdConnection<string>((complete, abort) => {
      if (OrdersEventHandler.responseCache.has(requestId)) {
        const responseEvent = OrdersEventHandler.responseCache.get(
          requestId,
        ) as OrderConfirmationEvent;
        OrdersEventHandler.responseCache.del(requestId);
        complete(responseEvent.orderId);
      }
    });
  }

  private waitForShipmentStatuses(requestId: string): Promise<
    {
      orderId: string;
      status: ShipmentStatus;
    }[]
  > {
    return PendingRequestHolder.holdConnection((complete, abort) => {
      if (OrdersEventHandler.responseCache.has(requestId)) {
        const responseEvent = OrdersEventHandler.responseCache.get(
          requestId,
        ) as GetShipmentStatusResponseEvent;
        OrdersEventHandler.responseCache.del(requestId);
        complete(responseEvent.result);
      }
    });
  }

  private sendGetMetaDataRequestEvent(productIds: string[]): string {
    const metaDataRequestEvent: GetMetadataRequestEvent = {
      type: "GET_METADATA_REQUEST",
      products: productIds,
    };
    this.client.emit("products", metaDataRequestEvent);
    return RequestIdGenerator.generateMetaDataRequestId(productIds);
  }

  private waitForMetaDataResponse(requestId: string): Promise<Product[]> {
    return PendingRequestHolder.holdConnection((complete, abort) => {
      if (OrdersEventHandler.responseCache.has(requestId)) {
        const responseEvent = OrdersEventHandler.responseCache.get(
          requestId,
        ) as GetMetadatResponseEvent;
        OrdersEventHandler.responseCache.del(requestId);

        complete(responseEvent.products);
      }
    });
  }
}
