import type { NextPage } from "next";
import { useRouter } from "next/router";
import AccountTopItem from "../../components/account/AccountTopItem";
import OrdersAddressButton from "../../components/account/OrdersAddressButton";
import { PageWithNavBar } from "../../components/page_containers/PageWithNavBar";
import styles from "../../styles/Account.module.scss";

//URL: /account

const AccountPage: NextPage = () => {
  const router = useRouter();
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
      </div>
    </PageWithNavBar>
  );
};

export default AccountPage;
