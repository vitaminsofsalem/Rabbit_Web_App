import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import AccountTopItem from "../../components/account/AccountTopItem";
import OrdersAddressButton from "../../components/account/OrdersAddressButton";
import { PageWithNavBar } from "../../components/page_containers/PageWithNavBar";
import { GlobalStateContext } from "../../model/GlobalState";
import styles from "../../styles/Account.module.scss";

//URL: /account

const AccountPage: NextPage = () => {
  const router = useRouter();
  const [globalState, setGlobalState] = useContext(GlobalStateContext);
  return (
    <PageWithNavBar>
      <div className={styles.parentContainer}>
        <AccountTopItem
          name="Youssef Henna"
          onEditClicked={() => {
            router.push("/account/edit");
          }}
        />
        <OrdersAddressButton
          onClick={() => {
            router.push("/account/orders");
          }}
          icon="orders"
          label="My Orders"
        />
        <OrdersAddressButton
          onClick={() => {
            router.push("/account/address");
          }}
          icon="addresses"
          label="My Addresses"
        />
        <div
          onClick={() => {
            localStorage.removeItem("token");
            setGlobalState({
              ...globalState,
              isLoggedIn: false,
              loggedInUserName: undefined,
              addresses: [],
              cart: [],
              selectedAddress: undefined,
            });
          }}
          className={`${styles.ordersAddressButtonContainer} ${styles.signOutButtonContainer}`}
        >
          <p
            className={`${styles.ordersAddressButtonText} ${styles.signOutText}`}
          >
            Log out
          </p>
        </div>
      </div>
    </PageWithNavBar>
  );
};

export default AccountPage;
