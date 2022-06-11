import type { NextPage } from "next";
import Image from "next/image";
import { PageWithNavBar } from "../../components/page_containers/PageWithNavBar";
import { useCartUpdater } from "../../util/CartUpdaterHook";
import styles from "../../styles/Cart.module.scss";
import Button from "../../components/common/Button";
import { useRouter } from "next/router";
import ModifiedProductCard from "../../components/product/ModifiedProductCard";
import { useContext, useState } from "react";
import { createPayment } from "../../remote/payments";
import { createOrder } from "../../remote/orders";
import { GlobalStateContext } from "../../model/GlobalState";
import { toast } from "react-toastify";
import { updateCart } from "../../remote/user";

//URL: /cart

const CartPage: NextPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [globalState, setGlobalState] = useContext(GlobalStateContext);

  //Use these functions for any changes to cart items
  const { currentCart } = useCartUpdater();

  // Get total price of all items in cart
  const currentAmount = currentCart.reduce((acc, curr) => {
    return acc + curr.price * curr.quantity;
  }, 0);

  const currentAmountFormatted = currentAmount.toFixed(2);

  const isAllInStock = currentCart.every((item) => item.currentQuantity > 0);

  const clearCart = () => {
    setGlobalState({ ...globalState, cart: [] });
    updateCart([]);
  };

  const createOrderFun = () => {
    setIsLoading(true);
    toast
      .promise(
        createOrder(
          globalState.selectedAddress!!,
          currentCart.map((item) => ({ id: item.id, quantity: item.quantity })),
          currentAmount
        ),
        { pending: "Creating order", error: "Failed to create order" }
      )
      .then((result) => {
        proceedToPayment(result.orderId);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const proceedToPayment = (orderId: string) => {
    toast
      .promise(createPayment(orderId, currentAmount), {
        pending: "Setting up payment",
        error: "Failed to create payment",
      })
      .then((result) => {
        clearCart();
        router.replace((result.stripeData as any).paymentUrl as string);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <PageWithNavBar>
      {currentCart.length !== 0 ? (
        <div className={styles.cartItems}>
          {currentCart.map((product, index) => (
            <ModifiedProductCard
              key={index}
              id={product.id}
              name={product.name}
              price={product.price}
              subtext={product.subtext}
              imageUrl={product.imageUrl}
              currentQuantity={product.currentQuantity}
              onQuantityChange={(q) => q}
              onClick={() => {}} // does nothing
            ></ModifiedProductCard>
          ))}

          <div className={styles.checkoutContainer}>
            <div className={styles.textItems}>
              <span className={styles.itemCount}>
                {currentCart.length + " item(s)"}
              </span>
              <span className={styles.total}>{currentAmountFormatted}</span>
            </div>
            <div className={styles.checkBtn}>
              <Button
                disabled={
                  isLoading ||
                  currentCart.length === 0 ||
                  globalState.selectedAddress === undefined ||
                  !isAllInStock
                }
                onClick={createOrderFun}
              >
                {`Checkout  ->`}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.parent}>
          <div className={styles.container}>
            <Image
              height={140}
              width={140}
              src={require("../../assets/Icons/cart.svg")}
              alt="Shopping_Cart_Logo"
            />
            <text className={styles.text}>
              It seems your cart is still empty
            </text>
            <div className={styles.button}>
              <Button onClick={() => router.push("/home")}>
                {"Browse Products"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageWithNavBar>
  );
};

export default CartPage;
