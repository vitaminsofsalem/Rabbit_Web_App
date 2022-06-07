import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { BackablePageWithNavBar } from "../../../components/page_containers/BackablePageWithNavBar";
import { Order } from "../../../model/Order";
import styles from "../../../styles/Order.module.scss";
import runningRabbit from "../../../assets/Icons/rabbit_running.png";
import React, { useEffect, useState } from "react";
import { OrderCartProduct, Product } from "../../../model/Product";
import ExternalImage from "../../../components/common/ExternalImage";
import { getOrder } from "../../../remote/orders";
import { toast } from "react-toastify";

//URL: /account/orders/{id}

const OrderDetailsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | undefined>(undefined);

  useEffect(() => {
    if (id) {
      toast
        .promise(getOrder(id as string), {
          pending: "Getting order",
          error: "Failed to get order",
        })
        .then((orderResult) => {
          setOrder(orderResult.order);
        });
    }
  }, [id]);

  const capitalizeFirstLetter = (str: string) => {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
  };

  return (
    <BackablePageWithNavBar title={`Order #${id}`}>
      {order && (
        <div className={styles.orderDetailsParentContainer}>
          <div className={styles.orderDetailsTopContainer}>
            <div className={styles.orderDetailsTopImageContainer}>
              <Image layout="responsive" src={runningRabbit} />
            </div>

            <div className={styles.orderDetailsTopBottom}>
              <p className={styles.orderDetailsTitle}>
                Order{" "}
                {capitalizeFirstLetter(
                  order.shipmentStatus !== "CREATED"
                    ? order.shipmentStatus.toLowerCase()
                    : order.status.toLowerCase()
                )}
              </p>
            </div>
          </div>
          <div className={styles.orderDetailsBottomContainer}>
            <div className={styles.orderDetailsSection}>
              <p className={styles.orderDetailsSectionTitle}>Items Ordered</p>
              <div
                className={
                  styles.orderDetailsSectionContainer +
                  " " +
                  styles.orderedItemsSection
                }
              >
                {order.products.map((product) => (
                  <OrderedItem product={product} />
                ))}
              </div>
            </div>
            <div className={styles.orderDetailsSection}>
              <p className={styles.orderDetailsSectionTitle}>Delivered To</p>
              <div className={styles.orderDetailsSectionContainer}>
                <div className={styles.addressTopContainer}>
                  <div className={styles.addressIcon} />
                  <p className={styles.addressName}>
                    {order.deliveryAddress.nickname}
                  </p>
                </div>
                <p className={styles.addressSubtitle}>
                  {order.deliveryAddress.street}
                </p>
                <p className={styles.addressSubtitle}>
                  {order.deliveryAddress.neighbourhood},{" "}
                  {order.deliveryAddress.city}
                </p>
              </div>
            </div>
            <div className={styles.orderDetailsSection}>
              <p className={styles.orderDetailsSectionTitle}>Bill Breakdown</p>
              <div className={styles.orderDetailsSectionContainer}>
                <div className={styles.priceContainer}>
                  <p className={styles.priceText}>Total</p>
                  <p className={styles.priceText}>
                    {order.total.toFixed(2)} EGP
                  </p>
                </div>
                <div className={styles.priceContainer}>
                  <p className={styles.priceText}>Delivery fees</p>
                  <p className={styles.priceText}>
                    {order.deliveryFees.toFixed(2)} EGP
                  </p>
                </div>
                <div className={styles.priceDivider} />
                <div className={styles.priceContainer}>
                  <p className={styles.priceTextBold}>Grand total</p>
                  <p className={styles.priceTextBold}>
                    {(order.deliveryFees + order.total).toFixed(2)} EGP
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </BackablePageWithNavBar>
  );
};

interface OrderedItemProps {
  product: OrderCartProduct;
}

const OrderedItem: React.FC<OrderedItemProps> = ({ product }) => {
  return (
    <div className={styles.orderedItemContainer}>
      <ExternalImage
        width={60}
        height={60}
        objectFit="contain"
        src={product.imageUrl}
      />
      <div className={styles.orderedItemTextContainer}>
        <p className={styles.orderedItemTitle}>{product.name}</p>
        <p className={styles.orderedItemPrice}>
          {product.price.toFixed(2)} EGP
        </p>
      </div>
      <p className={styles.orderedItemQuantity}>x{product.quantity}</p>
    </div>
  );
};

export default OrderDetailsPage;
