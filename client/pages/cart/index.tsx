import type { NextPage } from "next";
import { PageWithNavBar } from "../../components/page_containers/PageWithNavBar";
import { useCartUpdater } from "../../util/CartUpdaterHook";

//URL: /cart

const CartPage: NextPage = () => {
  //Use these functions for any changes to cart items
  const {
    incrementQuantity,
    decrementQuantity,
    getCurrentQuantity,
    currentCart,
  } = useCartUpdater();

  return (
    <PageWithNavBar>
      <div></div>
    </PageWithNavBar>
  );
};

export default CartPage;
