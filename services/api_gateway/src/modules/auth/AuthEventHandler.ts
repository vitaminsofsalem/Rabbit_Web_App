import * as NodeCache from "node-cache";
import { RequestIdGenerator } from "src/util/RequestIdGenerator";
import { VerifyResponseEvent } from "./dto/events/verify-event.dto";

export class AuthEventHandler {
  /* responseCache: Temporarily holds "RESPONSE" events. Active HTTP connections then check cache for required response
   * Expires after 15 seconds. In which case initiater HTTP connection probably expired or fulfilled*/
  static responseCache = new NodeCache({ stdTTL: 15000 });

  static handleUserEvent(data: any) {
    if (data.type === "VERIFY_RESPONSE") {
      const event = data as VerifyResponseEvent;
      const id = RequestIdGenerator.generateVerifyRequestId(
        event.email,
        event.code,
      );
      this.responseCache.set(id, event);
    }
  }
}
