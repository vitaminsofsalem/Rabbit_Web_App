import * as NodeCache from "node-cache";
import { RequestIdGenerator } from "src/util/RequestIdGenerator";
import { GetAddressResponseEvent } from "../dto/events/address-event.dto";

export class AddressEventHandler {
  /* responseCache: Temporarily holds "RESPONSE" events. Active HTTP connections then check cache for required response
   * Expires after 15 seconds. In which case initiater HTTP connection probably expired or fulfilled*/
  static responseCache = new NodeCache({ stdTTL: 15000 });

  static handleUserEvent(data: any) {
    if (data.type === "GET_ADDRESS_RESPONSE") {
      const event = data as GetAddressResponseEvent;
      const id = RequestIdGenerator.generateAddressRequestId(event.email);
      this.responseCache.set(id, event);
    }
  }
}
