import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddressItem from "../../../components/address/AddressItem";
import Button from "../../../components/common/Button";
import { BackablePageWithNavBar } from "../../../components/page_containers/BackablePageWithNavBar";
import { Address } from "../../../model/Address";
import { GlobalStateContext } from "../../../model/GlobalState";
import { deleteAddress, getAddresses } from "../../../remote/user";
import styles from "../../../styles/Address.module.scss";
import commonStyles from "../../../styles/Common.module.scss";

//URL: /account/address

const AddressPage: NextPage = () => {
  const router = useRouter();
  const [globalState, setGlobalState] = useContext(GlobalStateContext);
  const addresses = globalState.addresses;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    toast
      .promise(getAddresses(), {
        pending: "Getting addresses",
        error: "Failed to get addresses",
      })
      .then((addressResult) => {
        setGlobalState({
          ...globalState,
          addresses: addressResult.addresses,
          selectedAddress: addressResult.addresses
            ? addressResult.addresses[0]
            : undefined,
        });
      });
  }, []);

  const deleteAddressFun = (address: Address) => {
    setIsLoading(true);
    toast
      .promise(deleteAddress(address), {
        pending: "Deleting adress",
        error: "Failed to delete address, please try again",
        success: "Address deleted",
      })
      .then(() => {
        router.reload();
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const onAddressDeleteClick = (address: Address) => {
    if (!isLoading) {
      deleteAddressFun(address);
    }
  };

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

  return (
    <BackablePageWithNavBar title="My Addresses">
      <div className={styles.parentContainer}>
        {addresses.map((address, index) => (
          <AddressItem
            key={index}
            address={address}
            isSelected={isSameAddress(globalState.selectedAddress, address)}
            onDeleteClick={() => onAddressDeleteClick(address)}
            onSelectAddressClick={() => onSelectAddressClick(address)}
          />
        ))}
        <Button
          onClick={() => {
            router.push("/account/address/add");
          }}
          additionalClassName={commonStyles.maxWidthButton}
        >
          Add a new address
        </Button>
      </div>
    </BackablePageWithNavBar>
  );
};

export default AddressPage;
