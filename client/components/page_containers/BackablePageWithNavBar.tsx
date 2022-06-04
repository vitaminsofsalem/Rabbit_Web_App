import { ReactNode } from "react";
import { PageWithNavBar } from "./PageWithNavBar";
import styles from "../../styles/PageContainters.module.scss";
import { useRouter } from "next/router";

interface BackablePageWithNavBarProps {
  children: ReactNode;
  title: string;
  isLoginProtected?: boolean;
}

export const BackablePageWithNavBar: React.FC<BackablePageWithNavBarProps> = (
  props
) => {
  const router = useRouter();

  return (
    <PageWithNavBar isLoginProtected={props.isLoginProtected}>
      <div className={styles.backableParentContainer}>
        <div className={styles.backableTopContainer}>
          <div onClick={() => router.back()} className={styles.backIcon} />
          <div className={styles.backTitle}>{props.title}</div>
        </div>
        <div className={styles.underBackContainer}>{props.children}</div>
      </div>
    </PageWithNavBar>
  );
};
