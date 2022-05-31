import type { NextPage } from "next";
import { PageWithNavBar } from "../../components/page_containers/PageWithNavBar";
import styles from "../../styles/Home.module.scss";

//URL: /home

const HomePage: NextPage = () => {
  return (
    <PageWithNavBar>
      <div className={styles.categoryBoxContainer}>
        <div className={styles.categoryBoxPrevIcon}>
          <div className={styles.arrow}> </div>
        </div>

        <div className={styles.categoryBoxNextIcon}>
          <div className={styles.arrow}> </div>
        </div>
      </div>
    </PageWithNavBar>
  );
};

export default HomePage;
