import React, { ReactNode, useContext, useEffect, useState } from "react";
import NavigationBar from "../NavigationBar";
import Button from "../common/Button";
import { Address } from "../../model/Address";
import { GlobalStateContext } from "../../model/GlobalState";
import AddressItem from "../address/AddressItem";
import styles from "../../styles/PageContainters.module.scss";
import { useRouter } from "next/router";

interface PageWithNavBarProps {
  children: ReactNode;
  isLoginProtected?: boolean;
  isFlex?: boolean;
}

export const PageWithNavBar: React.FC<PageWithNavBarProps> = ({
  isLoginProtected = true,
  children,
  isFlex = true,
}) => {
  const [addressSelectorVisible, setAddressSelectorVisible] = useState(false);
  const [globalState, setGlobalState] = useContext(GlobalStateContext);
  const router = useRouter();
  useEffect(() => {
    if (!globalState.isLoggedIn && isLoginProtected) {
      router.replace("/home/auth/send");
    }
  }, [globalState.isLoggedIn]);

  return (
    <div className={styles.parentContainer}>
      <NavigationBar
        onAddressClick={() => {
          setAddressSelectorVisible(true);
        }}
      />
      <div
        className={styles.besideNavBarContainer}
        style={!isFlex ? { display: "block" } : {}}
      >
        {children}
      </div>
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
  const router = useRouter();
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
          onClick={() => {
            router.push("/account/address/add");
            props.onDismissRequest();
          }}
          color="yellow"
          additionalClassName={styles.button}
        >
          Add a new address
        </Button>

        <Button
          onClick={() => {
            router.push("/account/address");
            props.onDismissRequest();
          }}
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
