import { Address } from "../../model/Address";
import styles from "../../styles/Address.module.scss";

interface AddressItemProps {
  address: Address;
  isSelected: boolean;
  onSelectAddressClick: () => void;
  onDeleteClick: () => void;
}

const AddressItem: React.FC<AddressItemProps> = (props) => {
  return (
    <div
      className={`${styles.addressItemContainer} ${
        props.isSelected ? styles.addressItemContainerSelected : ""
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
        <div onClick={props.onDeleteClick} className={styles.deleteButton}>
          <div className={styles.deleteButtonIcon} />
          <p className={styles.deleteButtonText}>Delete</p>
        </div>
      </div>
    </div>
  );
};

export default AddressItem;
