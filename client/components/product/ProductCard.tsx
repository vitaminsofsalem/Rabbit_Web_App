import { useState } from "react";
import { Product } from "../../model/Product";
import styles from "../../styles/Home.module.scss";
import QuantiyItem from "./QuantityItem";

export interface ProductCardProps extends Product {
  onQuantityChange: (quantity: number) => any;
}

const ProductCard = (props: ProductCardProps) => {
  const [quantity, setQuanitty] = useState<number>(0);

  const quantityChangeDispatch = (
    parentCallback: (quantity: number) => any
  ) => {
    parentCallback(quantity); //useful for letting the parent component know the selected quantities
  };

  const decreaseQuantity = () => {
    setQuanitty(quantity - 1);
    quantityChangeDispatch(props.onQuantityChange);
  };

  const increaseQuantity = () => {
    if (quantity == props.currentQuantity) return;
    setQuanitty(quantity + 1);
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
    <div className={styles.productCard}>
      <div
        className={styles.image}
        style={{ backgroundImage: `url(${props.imageUrl})` }}
      ></div>
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
