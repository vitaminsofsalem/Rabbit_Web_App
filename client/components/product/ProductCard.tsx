import { useRouter } from "next/router";
import { useState } from "react";
import { Product } from "../../model/Product";
import styles from "../../styles/Home.module.scss";
import { useCartUpdater } from "../../util/CartUpdaterHook";
import ExternalImage from "../common/ExternalImage";
import QuantiyItem from "./QuantityItem";

export interface ProductCardProps extends Product {
  onQuantityChange: (quantity: number) => any;
  onClick: () => void;
}

const ProductCard = (props: ProductCardProps) => {
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
      <div className={styles.outOfStockMsg}>
        <p>Out Of Stock</p>
      </div>
    );
  }

  return (
    <div onClick={props.onClick} className={styles.productCard}>
      <ExternalImage
        width="100%"
        height={130}
        className={styles.image}
        src={props.imageUrl}
        objectFit="contain"
      />
      {quantityInStock > 0 && (
        <QuantiyItem
          onDecrement={decreaseQuantity}
          onIncrement={increaseQuantity}
          quantity={quantity}
          quantityInStock={quantityInStock}
        />
      )}
      <div className={styles.descriptions}>
        <p className={styles.price}>
          {price}
          <span className={styles.currency}>EGP</span>
        </p>
        {outOfStockMsg}
        <p className={styles.name}>{props.name}</p>
        <p className={styles.physicalDescription}>{props.subtext}</p>
      </div>
    </div>
  );
};

export default ProductCard;
