import React from "react";
import { Order } from "../../model/Order";
import styles from "../../styles/Order.module.scss";

interface OrderItemProps {
  order: Order;
  onOrderClick: () => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ order, onOrderClick }) => {
  const capitalizeFirstLetter = (str: string) => {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
  };

  const date = new Date(order.dateTime);
  return (
    <div onClick={onOrderClick} className={styles.orderItemContainer}>
      <div className={styles.orderItemTitlesContainer}>
        <p className={styles.orderItemTitle}>#{order.orderId}</p>
        <p className={styles.orderItemSubtitle}>
          on {date.toLocaleDateString("en-GB")}{" "}
          {date.toLocaleTimeString("en-US")}
        </p>
        <p className={styles.orderStatus}>
          {capitalizeFirstLetter(
            order.shipmentStatus !== "CREATED"
              ? order.shipmentStatus.toLowerCase()
              : order.status.toLowerCase()
          )}
        </p>
      </div>
      <p className={styles.orderPrice}>{order.grandTotal.toFixed(2)} EGP</p>
    </div>
  );
};

export default OrderItem;
