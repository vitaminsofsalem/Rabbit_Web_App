import { ReactNode } from "react";
import NavigationBar from "../NavigationBar";
import styles from "../../styles/PageContainters.module.scss";

interface PageWithNavBarProps {
  children: ReactNode;
}

export const PageWithNavBar: React.FC<PageWithNavBarProps> = (props) => {
  return (
    <div className={styles.parentContainer}>
      <NavigationBar />
      <div className={styles.besideNavBarContainer}>{props.children}</div>
    </div>
  );
};
