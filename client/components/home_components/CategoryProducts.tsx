import styles from "../../styles/Home.module.scss";

interface ProductCardProps {
  name: string;
  priceEgp: number;
  physicalDescription: string;
  imageUrl?: string;
}

const ProductCard = (props: ProductCardProps) => {
  const priceEgp = props.priceEgp.toFixed(2); //rounds to 2 decimal places
  //
  return (
    <div className={styles.productCard}>
      <div className={styles.image}></div>
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
