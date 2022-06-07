import { useRouter } from "next/router";
import { Product } from "../../model/Product";
import styles from "../../styles/Product.module.scss";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = (props) => {
  const router = useRouter();

  return (
    <div className={styles.productGridMainContainer}>
      {props.products.map((product, index) => (
        <ProductCard
          key={product.id + index}
          {...product}
          onQuantityChange={() => {}}
          onClick={() => {
            router.push("/home/product/" + product.id);
          }}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
