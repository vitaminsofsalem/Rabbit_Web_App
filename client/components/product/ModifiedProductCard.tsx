import { faShuttleSpace } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { useState } from "react";
import { Product } from "../../model/Product";
import styles from "../../styles/Home.module.scss";
import { useCartUpdater } from "../../util/CartUpdaterHook";
import ExternalImage from "../common/ExternalImage";
import QuantiyItem from "./QuantityItem";

export interface ModifiedProductCardProps extends Product {
  onQuantityChange: (quantity: number) => any;
  onClick: () => void;
}

const ModifiedProductCard = (props: ModifiedProductCardProps) => {
  const {
    incrementQuantity,
    decrementQuantity,
    getCurrentQuantity,
    currentCart,
  } = useCartUpdater();

  const product = props as Product;
  const quantity = getCurrentQuantity(product);

  const quantityChangeDispatch = (
    parentCallback: (quantity: number) => any
  ) => {
    parentCallback(quantity); //useful for letting the parent component know the selected quantities
  };

  const decreaseQuantity = () => {
    decrementQuantity(product);
    quantityChangeDispatch(props.onQuantityChange);
  };

  const increaseQuantity = () => {
    if (quantity == props.currentQuantity) return;
    incrementQuantity(product);
    quantityChangeDispatch(props.onQuantityChange);
  };

  const price = props.price.toFixed(2); //rounds to 2 decimal places
  const quantityInStock = props.currentQuantity;

  let currentButton = <></>;
  let outOfStockMsg = <></>;

  if (quantityInStock == 0) {
    outOfStockMsg = (
      <div className={styles.ModOutOfStockMsg}>
        <p>Out Of Stock</p>
      </div>
    );
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        props.onClick();
      }}
      className={styles.ModifiedProductCard}
    >
      <div className={styles.itemButtons}>
        <ExternalImage
          width={170}
          height={130}
          className={styles.ModImage}
          src={props.imageUrl}
          objectFit="contain"
        />

        <div className={styles.ModDescriptions}>
          <p className={styles.ModPrice}>
            {price}
            <span className={styles.ModCurrency}>EGP</span>
          </p>
          {outOfStockMsg}
          <p className={styles.ModName}>{props.name}</p>
          <p className={styles.ModPhysicalDescription}>{props.subtext}</p>
        </div>
        <div className={styles.buttonMan}>
          {quantityInStock > 0 && (
            <QuantiyItem
              onDecrement={decreaseQuantity}
              onIncrement={increaseQuantity}
              quantity={quantity}
              quantityInStock={quantityInStock}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModifiedProductCard;
