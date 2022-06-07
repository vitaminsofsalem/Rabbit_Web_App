import { useRouter } from "next/router";
import { useContext } from "react";
import { GlobalStateContext } from "../model/GlobalState";
import { OrderCartProduct, Product } from "../model/Product";
import { updateCart } from "../remote/user";

type CartUpdater = {
  incrementQuantity: (product: Product) => void;
  decrementQuantity: (product: Product) => void;
  getCurrentQuantity: (product: Product) => number;
  currentCart: OrderCartProduct[];
};

export function useCartUpdater(): CartUpdater {
  const [globalState, setGlobalState] = useContext(GlobalStateContext);
  const currentCart = globalState.cart;
  const router = useRouter();

  const incrementQuantity = (product: Product) => {
    if (!globalState.isLoggedIn) {
      router.replace("/home/auth/send");
      return;
    }
    const newCart = [...currentCart];
    let handled = false;
    for (const item of newCart) {
      if (item.id === product.id) {
        item.quantity++;
        handled = true;
        break;
      }
    }

    if (!handled) {
      newCart.push({ ...product, quantity: 1 });
    }
    setGlobalState({ ...globalState, cart: newCart });
    updateCart(
      newCart.map((item) => ({ id: item.id, quantity: item.quantity }))
    );
  };

  const decrementQuantity = (product: Product) => {
    const newCart = [...currentCart];
    for (let i = 0; i < newCart.length; i++) {
      const item = newCart[i];
      if (item.id === product.id) {
        if (item.quantity === 1) {
          newCart.splice(i, 1);
          break;
        } else {
          item.quantity--;
          break;
        }
      }
    }
    setGlobalState({ ...globalState, cart: newCart });
    updateCart(
      newCart.map((item) => ({ id: item.id, quantity: item.quantity }))
    );
  };

  const getCurrentQuantity = (product: Product) => {
    return currentCart.find((item) => item.id === product.id)?.quantity || 0;
  };

  return {
    incrementQuantity,
    decrementQuantity,
    getCurrentQuantity,
    currentCart,
  };
}
