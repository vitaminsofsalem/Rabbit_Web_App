import React, { ReactNode, useContext, useState } from "react";
import NavigationBar from "../NavigationBar";
import styles from "../../styles/PageContainters.module.scss";
import Button from "../common/Button";
import { Address } from "../../model/Address";
import { GlobalStateContext } from "../../model/GlobalState";
import AddressItem from "../address/AddressItem";

interface PageWithNavBarProps {
  children: ReactNode;
}

export const PageWithNavBar: React.FC<PageWithNavBarProps> = (props) => {
  const [addressSelectorVisible, setAddressSelectorVisible] = useState(false);
  return (
    <div className={styles.parentContainer}>
      <NavigationBar
        onAddressClick={() => {
          setAddressSelectorVisible(true);
        }}
      />
      <div className={styles.besideNavBarContainer}>{props.children}</div>
      <AddressSelector
        visible={addressSelectorVisible}
        onDismissRequest={() => setAddressSelectorVisible(false)}
      />
    </div>
  );
};

interface AddressSelectorProps {
  visible: boolean;
  onDismissRequest: () => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = (props) => {
  const [globalState, setGlobalState] = useContext(GlobalStateContext);

  const onSelectAddressClick = (address: Address) => {
    setGlobalState({ ...globalState, selectedAddress: address });
  };

  const isSameAddress = (address1?: Address, address2?: Address) => {
    if (!address1 || !address2) {
      return false;
    }
    return (
      address1.buildingNumber === address2.buildingNumber &&
      address1.nickname === address2.nickname &&
      address1.city === address2.city &&
      address1.neighbourhood === address2.neighbourhood
    );
  };

  return props.visible ? (
    <div
      onClick={props.onDismissRequest}
      className={styles.addressSelectorContainer}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={styles.addressSelectorBox}
      >
        <div className={styles.addressSelectorTop}>
          <p className={styles.addressSelectorTitle}>Select an address</p>
          <div
            onClick={props.onDismissRequest}
            className={styles.addressSelectorCloseIcon}
          />
        </div>
        {globalState.addresses.map((address) => (
          <AddressItem
            address={address}
            isSelected={isSameAddress(globalState.selectedAddress, address)}
            onSelectAddressClick={() => onSelectAddressClick(address)}
            useSecondaryColors
          />
        ))}
        <Button
          onClick={() => {}}
          color="yellow"
          additionalClassName={styles.button}
        >
          Add a new address
        </Button>

        <Button
          onClick={() => {}}
          additionalClassName={`${styles.button} ${styles.buttonSecondary}`}
        >
          Manage addresses
        </Button>
      </div>
    </div>
  ) : (
    <div />
  );
};
