import styles from "../../styles/Home.module.scss";
const CategoryProducts = () => {
  return (
    <div className={styles.categoryProductsContainer}>
      <div className={styles.categoryCard}>
        <h2>New Arrivals!</h2>
        <div className={styles.arrow}></div>
      </div>
    </div>
  );
};

export default CategoryProducts;
