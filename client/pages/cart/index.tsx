import type { NextPage } from "next";
import Image from "next/image";
import { PageWithNavBar } from "../../components/page_containers/PageWithNavBar";
import { useCartUpdater } from "../../util/CartUpdaterHook";
import styles from "../../styles/Cart.module.scss";
import Button from "../../components/common/Button";
import { useRouter } from "next/router";
import ModifiedProductCard from "../../components/product/ModifiedProductCard";

//URL: /cart

const CartPage: NextPage = () => {
  const router = useRouter();

  //Use these functions for any changes to cart items
  const { currentCart } = useCartUpdater();

  // Get total price of all items in cart
  const currentAmount = currentCart.reduce((acc, curr) => {
    return acc + curr.price * curr.quantity;
  }, 0);

  const currentAmountFormatted = currentAmount.toFixed(2);

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
              <Button onClick={() => router.push("/home")}>
                {`Checkout  ->`}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.parent}>
          <div className={styles.container}>
            <Image
              height={175}
              width={175}
              src={require("/../client/assets/Icons/cart.svg")}
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
