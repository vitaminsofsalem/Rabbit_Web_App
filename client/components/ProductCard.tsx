import { useState } from "react";
import styles from "../styles/Home.module.scss";

export interface ProductCardProps {
  name: string;
  priceEgp: number;
  physicalDescription: string;
  imageUrl?: string;
  maxQuantity: number;
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
    if (quantity == props.maxQuantity) return;
    setQuanitty(quantity + 1);
    quantityChangeDispatch(props.onQuantityChange);
  };

  const priceEgp = props.priceEgp.toFixed(2); //rounds to 2 decimal places
  //
  //

  let currentButton;

  if (quantity == 0) {
    currentButton = (
      <div className={styles.addButton} onClick={increaseQuantity}></div>
    );
  } else if (quantity < props.maxQuantity) {
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
      <div className={styles.image}></div>
      {currentButton}
      <div className={styles.descriptions}>
        <p className={styles.price}>
          {priceEgp}
          <div className={styles.currency}>EGP</div>
        </p>
        <p className={styles.name}>{props.name}</p>
        <p className={styles.physicalDescription}>
          {props.physicalDescription}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
