import { useState } from "react";
import { Product } from "../model/Product";
import styles from "../styles/Home.module.scss";

export interface ProductCardProps extends Product {
  name: string;
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
  } else if (quantity == 0) {
    currentButton = (
      <div className={styles.addButton} onClick={increaseQuantity}></div>
    );
  } else if (quantity < quantityInStock) {
    currentButton = (
      <div className={styles.addRemoveButton}>
        <div className={styles.removeButton} onClick={decreaseQuantity}>
          <div className={styles.quantity}>
            <p>{quantity}</p>
          </div>
        </div>
        <div className={styles.addButton2} onClick={increaseQuantity}></div>
      </div>
    );
  } else {
    currentButton = (
      <div className={styles.addRemoveButton}>
        <div className={styles.removeButton} onClick={decreaseQuantity}>
          <div className={styles.quantity}>
            <p>{quantity}</p>
          </div>
        </div>
        <div className={styles.addButtonDisabled}></div>
      </div>
    );
  }

  return (
    <div className={styles.productCard}>
      <div
        className={styles.image}
        style={{ backgroundImage: `url(${props.imageUrl})` }}
      ></div>
      {currentButton}
      <div className={styles.descriptions}>
        <p className={styles.price}>
          {price}
          <div className={styles.currency}>EGP</div>
        </p>
        {outOfStockMsg}
        <p className={styles.name}>{props.name}</p>
        <p className={styles.physicalDescription}>{props.subtext}</p>
      </div>
    </div>
  );
};

export default ProductCard;
