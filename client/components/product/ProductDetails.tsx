import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Product } from "../../model/Product";
import { getProductDetails } from "../../remote/product";
import styles from "../../styles/Product.module.scss";
import { useCartUpdater } from "../../util/CartUpdaterHook";
import ExternalImage from "../common/ExternalImage";
import QuantiyItem from "./QuantityItem";

interface ProductDetailsPageProps {
  id: string;
}

const ProductDetails: React.FC<ProductDetailsPageProps> = ({ id }) => {
  const [product, setProduct] = useState<Product | undefined>(undefined);

  const {
    incrementQuantity,
    decrementQuantity,
    getCurrentQuantity,
    currentCart,
  } = useCartUpdater();

  useEffect(() => {
    toast
      .promise(getProductDetails(id), {
        pending: "Getting product",
        error: "Failed to get product",
      })
      .then((productResult) => {
        setProduct(productResult.product);
      });
  }, []);

  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <>
      {product && (
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
      )}
    </>
  );
};

export default ProductDetails;
