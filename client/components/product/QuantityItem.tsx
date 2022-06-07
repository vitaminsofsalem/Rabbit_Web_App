import styles from "../../styles/Home.module.scss";

interface QuantityItemProps {
  quantity: number;
  quantityInStock: number;
  onDecrement: () => void;
  onIncrement: () => void;
  additionalClassName?: string;
}

const QuantiyItem: React.FC<QuantityItemProps> = ({
  quantity,
  quantityInStock,
  onIncrement,
  onDecrement,
  additionalClassName = "",
}) => {
  if (quantity == 0) {
    return (
      <div
        className={`${styles.addButton} ${additionalClassName}`}
        onClick={(e) => {
          e.stopPropagation();
          onIncrement();
        }}
      ></div>
    );
  } else if (quantity < quantityInStock) {
    return (
      <div className={`${styles.addRemoveButton} ${additionalClassName}`}>
        <div
          className={styles.removeButton}
          onClick={(e) => {
            e.stopPropagation();
            onDecrement();
          }}
        >
          <div className={styles.quantity}>
            <p>{quantity}</p>
          </div>
        </div>
        <div
          className={styles.addButton2}
          onClick={(e) => {
            e.stopPropagation();
            onIncrement();
          }}
        ></div>
      </div>
    );
  } else {
    return (
      <div className={`${styles.addRemoveButton} ${additionalClassName}`}>
        <div
          className={styles.removeButton}
          onClick={(e) => {
            e.stopPropagation();
            onDecrement();
          }}
        >
          <div className={styles.quantity}>
            <p>{quantity}</p>
          </div>
        </div>
        <div className={styles.addButtonDisabled}></div>
      </div>
    );
  }
};

export default QuantiyItem;
