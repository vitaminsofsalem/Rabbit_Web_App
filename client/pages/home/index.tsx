import type { NextPage } from "next";
import CategoryProducts from "../../components/home_components/CategoryProducts";
import SpecialCategories from "../../components/home_components/SpecialCategories";
import { PageWithNavBar } from "../../components/page_containers/PageWithNavBar";
import styles from "../../styles/Home.module.scss";

//URL: /home

const mockProducts: any[] = [
  {
    name: "Nutella Jar",
    physicalDescription: "500g",
    priceEgp: 70,
    maxQuantity: 3,
  },
  {
    name: "Pril Diswahsing Soap Liquid Green for kitchen",
    physicalDescription: "220ml",
    priceEgp: 30,
    maxQuantity: 3,
  },
];

const HomePage: NextPage = () => {
  return (
    <PageWithNavBar>
      <div className={styles.homeContainer}>
        <SpecialCategories />
        <CategoryProducts
          title="new arrivals!"
          color="#208F5C"
          products={mockProducts}
        />
      </div>
    </PageWithNavBar>
  );
};

export default HomePage;
