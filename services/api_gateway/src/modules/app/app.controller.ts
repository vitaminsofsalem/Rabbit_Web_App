import { Controller, Inject } from "@nestjs/common";
import {
  ClientKafka,
  Ctx,
  MessagePattern,
  NatsContext,
  Payload,
} from "@nestjs/microservices";
import { AuthEventHandler } from "../auth/AuthEventHandler";
import { OrdersEventHandler } from "../orders/event_handlers/OrdersEventHandler";
import { PaymentsEventHandler } from "../payments/event-handlers/PaymentsEventHandler";
import { ProductsEventhandler } from "../products/event-handlers/ProductsEventHandler";
import { AddressEventHandler } from "../user/event-handlers/AddressEventHandler";
import { CartEventHandler } from "../user/event-handlers/CartEventHandler";
import { FavoritesEventHandler } from "../user/event-handlers/FavoritesEventHandler";
import { NameEventHandler } from "../user/event-handlers/NameEventHandler";

/**
 * Kafka and Nestjs together are limited to use only one consumer group
 * Events are limited to be handled only once per group
 *
 * This creates a problem when having same MessagePattern for same topic in various controllers/modules (only one recives it)
 *
 * This class is central for recieving all events, and sending them to appropriate handlers
 */

@Controller()
export class AppController {
  constructor(@Inject("KAFKA_CLIENT") private client: ClientKafka) {}

  @MessagePattern("user")
  handleUserEvent(@Payload("value") data: any) {
    AuthEventHandler.handleUserEvent(data);
    AddressEventHandler.handleUserEvent(data);
    CartEventHandler.handleUserEvent(data);
    FavoritesEventHandler.handleUserEvent(data);
    NameEventHandler.handleUserEvent(data);
  }

  @MessagePattern("products")
  handleProductsEvent(@Payload("value") data: any) {
    CartEventHandler.handleProductsEvent(data);
    FavoritesEventHandler.handleProductsEvent(data);
    OrdersEventHandler.handleProductsEvents(data);
    ProductsEventhandler.handleProductsEvents(data);
  }

  @MessagePattern("order")
  handleOrderEvent(@Payload("value") data: any) {
    OrdersEventHandler.handleOrderEvents(data);
  }

  @MessagePattern("shipping")
  handleShippingEvent(@Payload("value") data: any) {
    OrdersEventHandler.handleShippingEvents(data);
  }

  @MessagePattern("payments")
  handlePaymentsEvent(@Payload("value") data: any) {
    PaymentsEventHandler.handlePaymentsEvent(data);
  }
}
