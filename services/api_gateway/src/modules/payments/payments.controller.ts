import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { PendingRequestHolder } from "src/util/PendingRequestHolder";
import { RequestIdGenerator } from "src/util/RequestIdGenerator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateOrderRequestDto } from "../orders/dto/create-order.dto";
import { NewOrderEvent } from "../orders/dto/events/order.dto";
import {
  CreatePaymentRequestDto,
  CreatePaymentResponseDto,
} from "./dto/create-payment.dto";
import {
  CreatePaymentRequestEvent,
  CreatePaymentResponseEvent,
} from "./dto/events/create-payment.dto";
import { VerifyPaymentEvent } from "./dto/events/verify-payment.dto";
import { VerifyPaymentRequestDto } from "./dto/verify-payment.dto";
import { PaymentsEventHandler } from "./event-handlers/PaymentsEventHandler";

@Controller("payments")
export class PaymentsController {
  constructor(@Inject("KAFKA_CLIENT") private readonly client: ClientKafka) {}

  @Post("create")
  @UseGuards(JwtAuthGuard)
  async createPayment(
    @Body() body: CreatePaymentRequestDto,
    @Request() req: any,
  ): Promise<CreatePaymentResponseDto> {
    const userEmail = req.user.email as string;
    const { orderId, orderTotal } = body;

    const requestEvent: CreatePaymentRequestEvent = {
      type: "CREATE_PAYMENT_REQUEST",
      email: userEmail,
      orderId,
      orderTotal,
    };
    this.client.emit("payments", requestEvent);
    const requestId = RequestIdGenerator.generateCreatePaymentRequestId(
      userEmail,
      orderId,
      orderTotal,
    );
    return {
      orderId,
      stripeData: await this.waitForCreatePaymentResponseResponse(requestId),
    };
  }

  @Post("verify")
  @UseGuards(JwtAuthGuard)
  verifyPayment(@Body() body: VerifyPaymentRequestDto, @Request() req: any) {
    const userEmail = req.user.email as string;
    const { orderId, stripeData } = body;

    const requestEvent: VerifyPaymentEvent = {
      type: "VERIFY",
      email: userEmail,
      orderId,
      stripeData,
    };
    this.client.emit("payments", requestEvent);
  }

  private waitForCreatePaymentResponseResponse(
    requestId: string,
  ): Promise<object> {
    return PendingRequestHolder.holdConnection<object>((complete, abort) => {
      if (PaymentsEventHandler.responseCache.has(requestId)) {
        const responseEvent = PaymentsEventHandler.responseCache.get(
          requestId,
        ) as CreatePaymentResponseEvent;
        PaymentsEventHandler.responseCache.del(requestId);
        complete(responseEvent.stripeData);
      }
    });
  }
}
