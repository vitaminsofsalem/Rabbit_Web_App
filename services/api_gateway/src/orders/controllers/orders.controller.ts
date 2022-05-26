import {
  Controller,
  Inject,
  UseGuards,
  Request,
  Get,
  Post,
  Body,
  Param,
} from "@nestjs/common";
import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";
import * as NodeCache from "node-cache";
import { Order, OrderProductDetailed } from "src/model/Order";
import { AdminAuthGuard } from "src/modules/auth/admin-auth.guard";
import { JwtAuthGuard } from "src/modules/auth/jwt-auth.guard";
import {
  GetMetadataRequestEvent,
  GetMetadatResponseEvent,
} from "../../user/dto/events/metadata-event";
import { PendingRequestHolder } from "src/util/PendingRequestHolder";
import { RequestIdGenerator } from "src/util/RequestIdGenerator";
import { CreateOrderRequestDto } from "../dto/create-order.dto";
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

@Controller("orders")
export class OrdersController {
  /* responseCache: Temporarily holds "RESPONSE" events. Active HTTP connections then check cache for required response
   * Expires after 15 seconds. In which case initiater HTTP connection probably expired or fulfilled*/
  private responseCache = new NodeCache({ stdTTL: 15000 });

  constructor(@Inject("KAFKA_CLIENT") private readonly client: ClientKafka) {}

  @MessagePattern("order")
  handleOrderEvents(@Payload("value") data: any) {
    if (data.type === "GET_ORDERS_RESPONSE") {
      const event = data as GetOrdersResponseEvent;
      const id = RequestIdGenerator.generateOrdersRequestId(event.email);
      this.responseCache.set(id, event);
    } else if (data.type === "GET_ORDER_RESPONSE") {
      const event = data as GetOrderResponseEvent;
      const id = RequestIdGenerator.generateOrderRequestId(
        event.email,
        event.order.id,
      );
      this.responseCache.set(id, event);
    }
  }

  @MessagePattern("shipping")
  handleShippingEvents(@Payload("value") data: any) {
    if (data.type === "GET_STATUS_RESPONSE") {
      const event = data as GetShipmentStatusResponseEvent;
      const id = RequestIdGenerator.generateOrderShipmentStatusRquestId(
        event.result.map((item) => item.orderId),
      );
      this.responseCache.set(id, event);
    }
  }

  @MessagePattern("products")
  handleProductEvents(@Payload("value") data: any) {
    if (data.type === "GET_METADATA_RESPONSE") {
      const event = data as GetMetadatResponseEvent;
      const id = RequestIdGenerator.generateMetaDataRequestId(
        event.products.map((val) => val.id),
      );
      this.responseCache.set(id, event);
    }
  }

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
  createOrder(@Body() body: CreateOrderRequestDto, @Request() req: any) {
    const userEmail = req.user.email as string;
    const { address, orderItems } = body;

    const newOrderEvent: NewOrderEvent = {
      type: "NEW_ORDER",
      email: userEmail,
      address,
      orderItems,
    };

    this.client.emit("order", newOrderEvent);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getOrders(@Request() req: any): Promise<GetOrdersResponseDto> {
    const userEmail = req.user.email as string;

    const requestEvent: GetOrdersRequestEvent = {
      type: "GET_ORDERS_REQUEST",
      email: userEmail,
    };
    const requestId = RequestIdGenerator.generateOrdersRequestId(userEmail);
    this.client.emit("order", requestEvent);

    //Wait for result of orders
    return PendingRequestHolder.holdConnection<Order[]>((complete, abort) => {
      if (this.responseCache.has(requestId)) {
        const responseEvent = this.responseCache.get(
          requestId,
        ) as GetOrdersResponseEvent;
        this.responseCache.del(requestId);
        complete(responseEvent.orders);
      }
    }).then((orders) => {
      const orderIds = orders.map((item) => item.id);
      const requestShipmentStatusEvent: GetShipmentStatusRequestEvent = {
        type: "GET_STATUS_REQUEST",
        orders: orderIds,
      };

      this.client.emit("shipping", requestShipmentStatusEvent);
      const shipmentStatusId =
        RequestIdGenerator.generateOrderShipmentStatusRquestId(orderIds);

      //Wait for results of shipment status
      return PendingRequestHolder.holdConnection((complete, abort) => {
        if (this.responseCache.has(shipmentStatusId)) {
          const responseEvent = this.responseCache.get(
            shipmentStatusId,
          ) as GetShipmentStatusResponseEvent;
          this.responseCache.del(requestId);
          complete({
            orders: orders.map((order) => {
              const statusItem = responseEvent.result.find(
                (item) => item.orderId === order.id,
              );
              return {
                ...order,
                shipmentStatus: statusItem.status,
              };
            }),
          });
        }
      });
    });
  }

  @Get("/:id")
  @UseGuards(JwtAuthGuard)
  getOrder(
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

    //Wait for result of orders
    return PendingRequestHolder.holdConnection<Order>((complete, abort) => {
      if (this.responseCache.has(requestId)) {
        const responseEvent = this.responseCache.get(
          requestId,
        ) as GetOrderResponseEvent;
        this.responseCache.del(requestId);
        complete(responseEvent.order);
      }
    }).then((order) => {
      const requestShipmentStatusEvent: GetShipmentStatusRequestEvent = {
        type: "GET_STATUS_REQUEST",
        orders: [order.id],
      };

      this.client.emit("shipping", requestShipmentStatusEvent);
      const shipmentStatusId =
        RequestIdGenerator.generateOrderShipmentStatusRquestId([order.id]);

      const orderProducts = order.products.map((item) => item.id);
      const metaDataRequestEvent: GetMetadataRequestEvent = {
        type: "GET_METADATA_REQUEST",
        products: orderProducts,
      };
      this.client.emit("products", metaDataRequestEvent);
      const metaDataRequestId =
        RequestIdGenerator.generateMetaDataRequestId(orderProducts);

      return this.waitForOrderShipmentStatus(order, shipmentStatusId).then(
        (orderWithStatus) => {
          return this.waitForOrderProductsMetaData(
            orderWithStatus,
            metaDataRequestId,
          );
        },
      );
    });
  }

  private waitForOrderShipmentStatus(
    order: Order,
    requestId: string,
  ): Promise<OrderWithShipment> {
    return PendingRequestHolder.holdConnection((complete, abort) => {
      if (this.responseCache.has(requestId)) {
        const responseEvent = this.responseCache.get(
          requestId,
        ) as GetShipmentStatusResponseEvent;
        this.responseCache.del(requestId);
        complete({
          ...order,
          shipmentStatus: responseEvent.result[0].status,
        });
      }
    });
  }

  private waitForOrderProductsMetaData(
    order: OrderWithShipment,
    requestId: string,
  ): Promise<GetOrderResponseDto> {
    return PendingRequestHolder.holdConnection((complete, abort) => {
      if (this.responseCache.has(requestId)) {
        const responseEvent = this.responseCache.get(
          requestId,
        ) as GetMetadatResponseEvent;
        this.responseCache.del(requestId);

        const detailedProducts: OrderProductDetailed[] = [];
        for (const item of order.products) {
          const correspondingMetaData = responseEvent.products.find(
            (meta) => meta.id === item.id,
          );
          detailedProducts.push({ ...item, ...correspondingMetaData });
        }

        complete({ order: { ...order, products: detailedProducts } });
      }
    });
  }
}
