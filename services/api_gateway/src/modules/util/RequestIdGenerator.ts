export class RequestIdGenerator {
  static generateVerifyRequestId(email: string, code: string) {
    return `VERIFY-${email}-${code}`;
  }

  static generateAddressRequestId(email: string) {
    return `GET-ADDRESS-${email}`;
  }

  static generateNameRequestId(email: string) {
    return `GET-NAME-${email}`;
  }

  static generateFavoritesRequestId(email: string) {
    return `FAVORITES-${email}`;
  }

  static generateCartRequestId(email: string) {
    return `CART-${email}`;
  }

  //Generates id based on hash of product ids
  static generateMetaDataRequestId(products: string[]) {
    let sum = 0;
    for (let i = 0; i < products.length; i++) {
      const cs = this.charsum(products[i]);
      sum = sum + 65027 / cs;
    }
    const hash = ("" + sum).slice(0, 16);

    return `METADATA-${hash}`;
  }

  private static charsum(s: string) {
    let sum = 0;
    for (let i = 0; i < s.length; i++) {
      sum += s.charCodeAt(i) * (i + 1);
    }
    return sum;
  }
}
