import { Address } from "../../model/Address";
import styles from "../../styles/Address.module.scss";

interface AddressItemProps {
  address: Address;
  isSelected: boolean;
  onSelectAddressClick: () => void;
  onDeleteClick?: () => void;
  useSecondaryColors?: boolean;
}

const AddressItem: React.FC<AddressItemProps> = (props) => {
  const selectedStyle = props.useSecondaryColors
    ? styles.addressItemContainerSelectedSecondary
    : styles.addressItemContainerSelected;

  return (
    <div
      className={`${styles.addressItemContainer} ${
        props.isSelected ? selectedStyle : ""
      } ${
        props.useSecondaryColors
          ? styles.addressItemContainerSecondaryColors
          : ""
      }`}
    >
      <div className={styles.addressItemTitlesContainer}>
        <p className={styles.addressItemTitle}>{props.address.nickname}</p>
        <p className={styles.addressItemSubtitle}>{props.address.street}</p>
        <p className={styles.addressItemSubtitle}>
          {props.address.neighbourhood}, {props.address.city}
        </p>
      </div>
      <div className={styles.addressItemBottomContainer}>
        <div
          onClick={props.onSelectAddressClick}
          className={styles.selectAddressButton}
        >
          <div className={styles.selectAddressButtonIcon} />
          <p className={styles.selectAddressButtonText}>
            {props.isSelected ? "Selected address" : "Select address"}
          </p>
        </div>
        {props.onDeleteClick && (
          <div onClick={props.onDeleteClick} className={styles.deleteButton}>
            <div className={styles.deleteButtonIcon} />
            <p className={styles.deleteButtonText}>Delete</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressItem;
