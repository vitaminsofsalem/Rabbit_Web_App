import { Controller, Get, Inject } from "@nestjs/common";
import {
  ClientKafka,
  Ctx,
  MessagePattern,
  NatsContext,
  Payload,
} from "@nestjs/microservices";
import { AppService } from "./services/app.service";
import Stripe from "stripe";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject("KAFKA_CLIENT") private client: ClientKafka,
    @Inject("STRIPE") private stripe: Stripe,
  ) {}

  //Example of handling an event on the topic: messages
  //data can be any type, as long as same as what is being sent above

  @MessagePattern("payments")
  async onPayment(
    @Payload("value")
    data: {
      orderTotal: number;
      orderId: string;
      requestId: string;
      type: string;
    },
  ) {
    switch (data.type) {
      case "CREATE_PAYMENT_REQUEST":
        try {
          const session = await this.stripe.checkout.sessions.create({
            line_items: [
              {
                price_data: {
                  currency: "egp",
                  product_data: {
                    name: data.orderId,
                  },
                  unit_amount: data.orderTotal,
                },
                quantity: 1,
              },
            ],
            mode: "payment",
            success_url: "https://example.com/success",
            cancel_url: "https://example.com/cancel",
          });

          this.client.emit("payments", {
            ...data,
            type: "PENDING_PAYMENT",
            paymentUrl: session.url,
          });
        } catch (err) {
          console.log(err);
          this.client.emit("payments", {
            ...data,
            type: "PAYMENT_ERROR",
          });
        }

      // const paymentIntent = await this.stripe.paymentIntents.create({
      //   amount: data.amount,
      //   currency: "egp",
      //   payment_method_types: ["card"],
      // });
    }
  }
}
