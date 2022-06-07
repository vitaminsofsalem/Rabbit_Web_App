import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import OrderItem from "../../../components/orders/OrderItem";
import { BackablePageWithNavBar } from "../../../components/page_containers/BackablePageWithNavBar";
import { Order } from "../../../model/Order";
import { getOrders } from "../../../remote/orders";
import styles from "../../../styles/Order.module.scss";

//URL: /account/orders

const OrdersPage: NextPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    toast
      .promise(getOrders(), {
        pending: "Getting orders",
        error: "Failed to get orders",
      })
      .then((ordersResult) => {
        setOrders(ordersResult.orders);
      });
  }, []);

  return (
    <BackablePageWithNavBar title="My Orders">
      <div className={styles.parentContainer}>
        {orders.map((order) => (
          <OrderItem
            order={order}
            onOrderClick={() => {
              router.push("/account/orders/" + order.id);
            }}
          />
        ))}
      </div>
    </BackablePageWithNavBar>
  );
};

export default OrdersPage;
