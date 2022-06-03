import styles from "../../styles/Home.module.scss";
import ProductCard from "../ProductCard";

interface CategoryProductsProps {
  title: string;
  color: string;
  products?: any; //kept 'any' until we agree on a common product objec structure
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
      {props.products.map((p: any) => (
        <ProductCard
          name={p.name}
          physicalDescription={p.physicalDescription}
          priceEgp={p.priceEgp}
          maxQuantity={p.maxQuantity}
          onQuantityChange={(q) => q} //does nothing for now
        />
      ))}
    </div>
  );
};

export default CategoryProducts;
