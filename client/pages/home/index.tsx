import type { NextPage } from "next";
import CategoryProducts from "../../components/home_components/CategoryProducts";
import SpecialCategories from "../../components/home_components/SpecialCategories";
import { PageWithNavBar } from "../../components/page_containers/PageWithNavBar";
import styles from "../../styles/Home.module.scss";

//URL: /home

const HomePage: NextPage = () => {
  return (
    <PageWithNavBar>
      <div className={styles.homeContainer}>
        <SpecialCategories />
        <CategoryProducts />
      </div>
    </PageWithNavBar>
  );
};

export default HomePage;
