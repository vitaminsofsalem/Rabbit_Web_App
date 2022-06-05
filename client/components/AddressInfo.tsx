import React, { useContext } from "react";
import { GlobalStateContext } from "../model/GlobalState";
import styles from "../styles/NavigationBar.module.scss";

interface AddressInfoProps {
  onClick: () => void;
}

const AddressInfo: React.FC<AddressInfoProps> = (props) => {
  const [globalState, setGlobalState] = useContext(GlobalStateContext);
  const address = globalState.selectedAddress;

  return globalState.isLoggedIn ? (
    <div
      onClick={props.onClick}
      className={`${styles.addressInfoContainer} ${
        !address ? styles.addressInfoContainerNoSelection : ""
      }`}
    >
      {address ? (
        <div className={styles.addressBoard}>
          <div className={styles.divText}>
            Delivers to <div className={styles.pinIcon}></div>{" "}
            <b> {address.nickname} </b>
          </div>
          <div className={styles.arrowIcon}></div>
        </div>
      ) : (
        <div className={styles.addressBoard}>
          <div className={styles.divText}>Select address</div>
        </div>
      )}
      {address && (
        <div className={styles.timeBoard}>
          <div className={styles.divText}>
            <div className={styles.clockIcon}></div> 17 mins
          </div>
        </div>
      )}
    </div>
  ) : (
    <div />
  );
};

export default AddressInfo;
