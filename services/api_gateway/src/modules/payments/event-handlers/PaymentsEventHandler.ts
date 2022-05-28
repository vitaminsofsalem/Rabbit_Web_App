import * as NodeCache from "node-cache";
import { RequestIdGenerator } from "src/util/RequestIdGenerator";
import { CreatePaymentResponseEvent } from "../dto/events/create-payment.dto";

export class PaymentsEventHandler {
  /* responseCache: Temporarily holds "RESPONSE" events. Active HTTP connections then check cache for required response
   * Expires after 15 seconds. In which case initiater HTTP connection probably expired or fulfilled*/
  static responseCache = new NodeCache({ stdTTL: 15000 });

  static handlePaymentsEvent(data: any) {
    if (data.type === "CREATE_PAYMENT_RESPONSE") {
      const event = data as CreatePaymentResponseEvent;
      const id = RequestIdGenerator.generateCreatePaymentRequestId(
        event.email,
        event.orderId,
        event.orderTotal,
      );
      this.responseCache.set(id, event);
    }
  }
}
