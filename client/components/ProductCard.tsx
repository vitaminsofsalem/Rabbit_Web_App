import { useState } from "react";
import styles from "../styles/Home.module.scss";

export interface ProductCardProps {
  name: string;
  priceEgp: number;
  physicalDescription: string;
  imageUrl?: string;
}

const ProductCard = (props: ProductCardProps) => {
  const [quantity, setQuanitty] = useState(0);
  const priceEgp = props.priceEgp.toFixed(2); //rounds to 2 decimal places
  //
  //
  const addButton = (
    <div className={styles.addButton} onClick={() => setQuanitty(1)}></div>
  );

  const addRemoveButton = (
    <div className={styles.addRemoveButton}>
      <div
        className={styles.removeButton}
        onClick={() => setQuanitty(quantity - 1)}
      >
        <div className={styles.quantity}>
          <p>{quantity}</p>
        </div>
      </div>
      <div
        className={styles.addButton2}
        onClick={() => setQuanitty(quantity + 1)}
      ></div>
    </div>
  );
  const currentButton = quantity ? addRemoveButton : addButton;

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
