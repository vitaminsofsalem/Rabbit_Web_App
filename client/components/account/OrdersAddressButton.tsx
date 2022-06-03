import styles from "../../styles/Account.module.scss";

interface OrdersAddressButtonProps {
  label: string;
  icon: "orders" | "addresses";
  onClick: () => void;
}

const OrdersAddressButton: React.FC<OrdersAddressButtonProps> = (props) => {
  const iconClass =
    props.icon === "orders" ? styles.ordersIcon : styles.locationIcon;

  return (
    <div
      onClick={props.onClick}
      className={styles.ordersAddressButtonContainer}
    >
      <div className={styles.ordersAddressButtonIconContainer}>
        <div className={`${styles.ordersAddressButtonIcon} ${iconClass}`} />
      </div>
      <p className={styles.ordersAddressButtonText}>{props.label}</p>
    </div>
  );
};

export default OrdersAddressButton;
