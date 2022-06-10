import { Controller, Get, Inject } from "@nestjs/common";
import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";
import { AppService } from "./services/app.service";
import Stripe from "stripe";
import {
  CreatePaymentRequestEvent,
  CreatePaymentResponseEvent,
} from "src/dto/create-payment.dto";
import { VerifyPaymentEvent } from "src/dto/verify-payment.dto";
import { OrderStatusUpdateEvent } from "src/dto/order-status-update.dto";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject("KAFKA_CLIENT") private client: ClientKafka,
    @Inject("STRIPE") private stripe: Stripe,
  ) {}

  @MessagePattern("payments")
  async onPayment(
    @Payload("value")
    data: any,
  ) {
    if (data.type === "CREATE_PAYMENT_REQUEST") {
      const event = data as CreatePaymentRequestEvent;
      try {
        const session = await this.stripe.checkout.sessions.create({
          line_items: [
            {
              price_data: {
                currency: "egp",
                product_data: {
                  name: event.orderId,
                },
                unit_amount: event.orderTotal,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url:
            "http://localhost:3000/account/payment?session_id={CHECKOUT_SESSION_ID}&order_id=" +
            event.orderId,
          cancel_url:
            "http://localhost:3000/account/payment?session_id={CHECKOUT_SESSION_ID}&order_id=" +
            event.orderId,
        });

        const responseEvent: CreatePaymentResponseEvent = {
          type: "CREATE_PAYMENT_RESPONSE",
          stripeData: { paymentUrl: session.url },
          orderTotal: event.orderTotal,
          orderId: event.orderId,
          email: event.email,
        };
        this.client.emit("payments", responseEvent);
      } catch (err) {
        console.log(err);
      }
    } else if (data.type === "VERIFY") {
      const event = data as VerifyPaymentEvent;
      const session = await this.stripe.checkout.sessions.retrieve(
        (event.stripeData as any).paymentId,
      );
      if (session.status === "complete" && session.payment_status === "paid") {
        const orderStatusEvent: OrderStatusUpdateEvent = {
          type: "UPDATE_STATUS",
          email: event.email,
          newStatus: "FULFILLED",
          orderId: event.orderId,
        };
        this.client.emit("order", orderStatusEvent);
      } else {
        this.stripe.checkout.sessions.expire(session.id);
        const orderStatusEvent: OrderStatusUpdateEvent = {
          type: "UPDATE_STATUS",
          email: event.email,
          newStatus: "CANCELLED",
          orderId: event.orderId,
        };
        this.client.emit("order", orderStatusEvent);
      }
    }
  }
}
