import styles from "../../styles/Home.module.scss";
import ProductCard from "../product/ProductCard";
import { Product } from "../../model/Product";

interface CategoryProductsProps {
  title: string;
  color: string;
  products: Product[]; //kept 'any' until we agree on a common product objec structure
}
const CategoryProducts = (props: CategoryProductsProps) => {
  return (
    <div className={styles.categoryProducts}>
      <div
        className={styles.categoryCard}
        style={{ backgroundColor: props.color }}
      >
        <h2>{props.title}</h2>
        <div className={styles.arrow}></div>
        <div className={styles.categoryImage}></div>
      </div>
      {props.products.map((p: Product) => (
        <ProductCard
          id={p.id}
          name={p.name}
          subtext={p.subtext}
          price={p.price}
          currentQuantity={p.currentQuantity}
          imageUrl={p.imageUrl}
          onQuantityChange={(q) => q} //does nothing for now
        />
      ))}
    </div>
  );
};

export default CategoryProducts;
