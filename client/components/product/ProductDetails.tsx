import { useState } from "react";
import { Product } from "../../model/Product";
import styles from "../../styles/Product.module.scss";
import { useCartUpdater } from "../../util/CartUpdaterHook";
import ExternalImage from "../common/ExternalImage";
import QuantiyItem from "./QuantityItem";

//TODO: Remove mock and integrate with api
const product: Product = {
  id: "1",
  name: "Nutella Jar",
  subtext: "500g",
  price: 70,
  imageUrl:
    "http://fhtrpi4.ddns.net:8821/e4f2f072b3821e7e004d80d6e469962d09c4c01a_356882_01.png",
  currentQuantity: 3,
};

interface ProductDetailsPageProps {
  id: string;
}

const ProductDetails: React.FC<ProductDetailsPageProps> = ({ id }) => {
  const {
    incrementQuantity,
    decrementQuantity,
    getCurrentQuantity,
    currentCart,
  } = useCartUpdater();

  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className={styles.productDetailsMainContainer}>
      <ExternalImage
        width={254}
        height={254}
        className={styles.image}
        src={product.imageUrl}
        objectFit="contain"
      />
      <div className={styles.productDetailsBoxContainer}>
        <p className={styles.productDetailsName}>{product.name}</p>
        <p className={styles.productDetailsPhysicalDescription}>
          {product.subtext}
        </p>
        <div className={styles.productDetailsDivider} />
        <div className={styles.productDetailsBottom}>
          <div
            onClick={() => setIsFavorite(!isFavorite)}
            className={`${styles.productDetailsHeart} ${
              isFavorite ? styles.productDetailsHeartSelected : ""
            }`}
          />
          <div className={styles.productDetailsDivider} />
          <p className={styles.productDetailsPrice}>
            {product.price}
            <span className={styles.currency}>EGP</span>
          </p>
          {product.currentQuantity > 0 ? (
            <QuantiyItem
              additionalClassName={styles.addButton}
              onDecrement={() => decrementQuantity(product)}
              onIncrement={() => incrementQuantity(product)}
              quantity={getCurrentQuantity(product)}
              quantityInStock={product.currentQuantity}
            />
          ) : (
            <div className={styles.outOfStockMsg}>
              <p>Out Of Stock</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
