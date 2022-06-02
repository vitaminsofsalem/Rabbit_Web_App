import styles from "../../styles/Home.module.scss";
import ProductCard from "../ProductCard";

const CategoryProducts = () => {
  return (
    <div className={styles.categoryProducts}>
      <div className={styles.categoryCard}>
        <h2>New Arrivals!</h2>
        <div className={styles.arrow}></div>
        <div className={styles.categoryImage}></div>
      </div>
      <ProductCard
        name="Nutella Jar"
        physicalDescription="500g"
        priceEgp={70}
      />
      <ProductCard
        name="Pril Diswahsing Soap Liquid Green for kitchen"
        physicalDescription="220ml"
        priceEgp={30}
      />
    </div>
  );
};

export default CategoryProducts;
