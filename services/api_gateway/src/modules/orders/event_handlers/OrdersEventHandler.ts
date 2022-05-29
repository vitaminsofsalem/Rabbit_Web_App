import * as NodeCache from "node-cache";
import { GetMetadatResponseEvent } from "src/modules/user/dto/events/metadata-event";
import { RequestIdGenerator } from "src/util/RequestIdGenerator";
import {
  GetOrdersResponseEvent,
  GetOrderResponseEvent,
} from "../dto/events/get-order.dto";
import { GetShipmentStatusResponseEvent } from "../dto/events/get-shipment-status.dto";

export class OrdersEventHandler {
  /* responseCache: Temporarily holds "RESPONSE" events. Active HTTP connections then check cache for required response
   * Expires after 15 seconds. In which case initiater HTTP connection probably expired or fulfilled*/
  static responseCache = new NodeCache({ stdTTL: 15000 });

  static handleOrderEvents(data: any) {
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

  static handleShippingEvents(data: any) {
    if (data.type === "GET_STATUS_RESPONSE") {
      const event = data as GetShipmentStatusResponseEvent;
      const id = RequestIdGenerator.generateOrderShipmentStatusRquestId(
        event.result.map((item) => item.orderId),
      );
      this.responseCache.set(id, event);
    }
  }

  static handleProductsEvents(data: any) {
    if (data.type === "GET_METADATA_RESPONSE") {
      const event = data as GetMetadatResponseEvent;
      const id = RequestIdGenerator.generateMetaDataRequestId(
        event.products.map((val) => val.id),
      );
      this.responseCache.set(id, event);
    }
  }
}
