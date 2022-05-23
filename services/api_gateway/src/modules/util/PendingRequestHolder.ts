import { HttpException, HttpStatus } from "@nestjs/common";

export class PendingRequestHolder {
  /**
   * Holds connection open until timeout, or until completed/aborted using callbacks
   * @param onIntervalCheck Function that will run repeatdly at predetrmined intervals, this is where you check if result for pending request arrived or not. Complete/abort connection using provided callbacks
   * @param timeoutAfter Maximum hold time before request is timed out (defaults to 15000)
   * @returns
   */
  static holdConnection<Type>(
    onIntervalCheck: (
      completeConnection: (response: Type) => void,
      abortConnection: (err: Error) => void,
    ) => void,
    timeoutAfter: number = 15000,
  ): Promise<Type> {
    return new Promise((resolve, reject) => {
      let connectionTime = 0;
      const interval = setInterval(() => {
        onIntervalCheck(
          (res) => {
            clearInterval(interval);
            resolve(res);
          },
          (err) => {
            clearInterval(interval);
            reject(err);
          },
        );
        connectionTime += 200;

        if (connectionTime >= timeoutAfter) {
          clearInterval(interval);
          reject(
            new HttpException("Request timed out", HttpStatus.REQUEST_TIMEOUT),
          );
        }
      }, 200);
    });
  }
}
