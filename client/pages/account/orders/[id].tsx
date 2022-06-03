import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { BackablePageWithNavBar } from "../../../components/page_containers/BackablePageWithNavBar";
import { Order } from "../../../model/Order";
import styles from "../../../styles/Order.module.scss";
import runningRabbit from "../../../assets/Icons/rabbit_running.png";
import React from "react";
import { OrderCartProduct, Product } from "../../../model/Product";
import ExternalImage from "../../../components/common/ExternalImage";

//TODO: Remove placeholder order and implment using API endpoint
const order: Order = {
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
  products: [
    {
      currentQuantity: 1,
      id: "2",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/0521/3650/9593/products/Nutella-Front.png?v=1621126635",
      name: "Nutella",
      price: 24.99,
      quantity: 1,
      subtext: "100g",
    },
    {
      currentQuantity: 1,
      id: "2",
      imageUrl:
        "https://media1.popsugar-assets.com/files/thumbor/4JWSXmzzR6JbPsdLvZ7Od6bK0C4/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2020/08/10/923/n/1922195/tmp_scvKXf_3c779c71bf1dae7c_CHOCOLATE_HAZELNUT.PNG",
      name: "Oreo",
      price: 34.99,
      quantity: 1,
      subtext: "6 pack",
    },
  ],
  shipmentStatus: "CREATED",
  status: "FULFILLED",
  total: 345,
};

//URL: /account/orders/{id}

const OrderDetailsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const capitalizeFirstLetter = (str: string) => {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
  };

  return (
    <BackablePageWithNavBar title={`Order #${id}`}>
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
                <p className={styles.priceText}>{order.total.toFixed(2)} EGP</p>
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
