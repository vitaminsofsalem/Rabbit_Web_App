import { Cart } from "../model/Cart";
import { Product } from "../model/Product";

export class CartGenerator {
  incrementQuantity(product: Product, currentCart: Cart): Cart {
    const newCart = { ...currentCart };
    let handled = false;
    for (const item of newCart.cart) {
      if (item.id === product.id) {
        item.currentQuantity++;
        handled = true;
        break;
      }
    }

    if (!handled) {
      newCart.cart.push({ ...product, quantity: 0 });
    }

    return newCart;
  }

  decrementQuantity(product: Product, currentCart: Cart): Cart {
    const newCart = { ...currentCart };
    for (let i = 0; i < newCart.cart.length; i++) {
      const item = newCart.cart[i];
      if (item.id === product.id) {
        if (item.currentQuantity === 1) {
          newCart.cart.splice(i, 1);
          break;
        } else {
          item.currentQuantity--;
          break;
        }
      }
    }
    return newCart;
  }
}
