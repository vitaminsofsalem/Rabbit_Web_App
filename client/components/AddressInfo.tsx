import React from "react";
import styles from "../styles/NavigationBar.module.scss";

interface AddressInfoProps {
  onClick: () => void;
}

const AddressInfo: React.FC<AddressInfoProps> = (props) => {
  return (
    <div onClick={props.onClick} className={styles.addressInfoContainer}>
      <div className={styles.addressBoard}>
        <div className={styles.divText}>
          Delivers to <div className={styles.pinIcon}></div> <b> Home </b>
        </div>
        <div className={styles.arrowIcon}></div>
      </div>

      <div className={styles.timeBoard}>
        <div className={styles.divText}>
          <div className={styles.clockIcon}></div> 17 mins
        </div>
      </div>
    </div>
  );
};

export default AddressInfo;
