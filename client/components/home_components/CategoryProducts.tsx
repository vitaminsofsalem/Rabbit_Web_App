import styles from "../../styles/Home.module.scss";
import ProductCard from "../product/ProductCard";
import { Product } from "../../model/Product";
import { mapCategoryToLabel } from "../../util/CategoryMapper";

interface CategoryProductsProps {
  title: string;
  color: string;
  products: Product[]; //kept 'any' until we agree on a common product objec structure
  onProductClick: (id: string) => void;
}
const CategoryProducts = (props: CategoryProductsProps) => {
  return (
    <div className={styles.categoryProducts}>
      <div
        className={styles.categoryCard}
        style={{ backgroundColor: props.color }}
      >
        <h2>{mapCategoryToLabel(props.title)}</h2>
        <div className={styles.arrow}></div>
      </div>
      {props.products.map((p: Product, index) => (
        <ProductCard
          onClick={() => props.onProductClick(p.id)}
          key={p.id + index}
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
