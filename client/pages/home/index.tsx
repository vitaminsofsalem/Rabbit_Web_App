import type { NextPage } from "next";
import SpecialCategories from "../../components/home_components/SpecialCategories";
import { PageWithNavBar } from "../../components/page_containers/PageWithNavBar";
import styles from "../../styles/Home.module.scss";

//URL: /home

const HomePage: NextPage = () => {
  return (
    <PageWithNavBar>
      <SpecialCategories />
    </PageWithNavBar>
  );
};

export default HomePage;
