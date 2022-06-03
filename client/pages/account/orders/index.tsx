import type { NextPage } from "next";
import { useRouter } from "next/router";
import OrderItem from "../../../components/orders/OrderItem";
import { BackablePageWithNavBar } from "../../../components/page_containers/BackablePageWithNavBar";
import { Order } from "../../../model/Order";
import styles from "../../../styles/Order.module.scss";

//URL: /account/orders

//TODO: Remove placeholder orders and implment using API endpoint
const orders: Order[] = [
  {
    dateTime: Date.now(),
    deliveryAddress: {
      buildingNumber: "227",
      city: "Cairo",
      neighbourhood: "Yasmine 5",
      nickname: "Home",
      street: "Youssef St",
    },
    deliveryFees: 10,
    grandTotal: 355,
    id: "KXB-32321",
    products: [],
    shipmentStatus: "CREATED",
    status: "FULFILLED",
    total: 345,
  },
  {
    dateTime: Date.now(),
    deliveryAddress: {
      buildingNumber: "227",
      city: "Cairo",
      neighbourhood: "Yasmine 5",
      nickname: "Home",
      street: "Youssef St",
    },
    deliveryFees: 10,
    grandTotal: 355,
    id: "ZSD-52321",
    products: [],
    shipmentStatus: "SHIPPED",
    status: "FULFILLED",
    total: 345,
  },
];

const OrdersPage: NextPage = () => {
  const router = useRouter();
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
