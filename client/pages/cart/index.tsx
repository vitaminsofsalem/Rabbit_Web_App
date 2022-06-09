import type { NextPage } from "next";
import Image from "next/image";
import { PageWithNavBar } from "../../components/page_containers/PageWithNavBar";
import { useCartUpdater } from "../../util/CartUpdaterHook";
import styles from "../../styles/Cart.module.scss";
import Button from "../../components/common/Button";
import { useRouter } from "next/router";

//URL: /cart

const CartPage: NextPage = () => {
  const router = useRouter();

  //Use these functions for any changes to cart items
  const {
    incrementQuantity,
    decrementQuantity,
    getCurrentQuantity,
    currentCart,
  } = useCartUpdater();

  return (
    <PageWithNavBar>
      <div className={styles.parent}>
        <div className={styles.container}>
          <Image
            height={175}
            width={175}
            src={require("/../client/assets/Icons/cart.svg")}
            alt="Shopping_Cart_Logo"
          />
          <text className={styles.text}>It seems your cart is still empty</text>
          <div className={styles.button}>
            <Button onClick={() => router.push("/home")}>
              {"Browse Products"}
            </Button>
          </div>
        </div>
      </div>
    </PageWithNavBar>
  );
};

export default CartPage;
