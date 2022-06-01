import styles from "../styles/NavigationBar.module.scss";
const AddressInfo = () => {
  return (
    <div className={styles.addressInfoContainer}>
      <div className={styles.addressBoard}>
        <p>
          Delivers to <div className={styles.pinIcon}></div> <b> Home </b>
        </p>
        <div className={styles.arrowIcon}></div>
      </div>

      <div className={styles.timeBoard}>
        <p>
          <div className={styles.clockIcon}></div> 17 mins
        </p>
      </div>
    </div>
  );
};

export default AddressInfo;
