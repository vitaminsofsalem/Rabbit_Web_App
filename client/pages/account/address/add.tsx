import type { NextPage } from "next";
import { BackablePageWithNavBar } from "../../../components/page_containers/BackablePageWithNavBar";
import styles from "../../../styles/FormPage.module.scss";
import commonStyles from "../../../styles/Common.module.scss";
import { useState } from "react";
import Button from "../../../components/common/Button";
import InputField from "../../../components/common/InputField";
import { addAddress } from "../../../remote/user";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

//URL: /account/address/add

const AddAddressPage: NextPage = () => {
  const [city, setCity] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");
  const [street, setStreet] = useState("");
  const [buildingNumber, setBuildingNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const addressValid =
    city.length > 0 &&
    neighbourhood.length > 0 &&
    street.length > 0 &&
    buildingNumber.length > 0 &&
    nickname.length > 0;

  const addAddressFun = () => {
    setIsLoading(true);
    toast
      .promise(
        addAddress({ buildingNumber, city, neighbourhood, nickname, street }),
        {
          pending: "Updating name",
          error: "Failed to update name, please try again",
          success: "Address added",
        }
      )
      .then(() => {
        router.back();
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <BackablePageWithNavBar title="Add New Address">
      <div className={styles.parentContainer}>
        <InputField
          label="City"
          value={city}
          onValueChange={setCity}
          placeholder="Enter city"
        />
        <InputField
          label="Neighbourhood"
          value={neighbourhood}
          onValueChange={setNeighbourhood}
          placeholder="Enter neighbourhood"
        />
        <InputField
          label="Street"
          value={street}
          onValueChange={setStreet}
          placeholder="Enter street"
        />
        <InputField
          label="Building Number"
          value={buildingNumber}
          onValueChange={setBuildingNumber}
          placeholder="Enter building number"
        />
        <InputField
          label="Give the address a nickname"
          value={nickname}
          onValueChange={setNickname}
          placeholder="Home, Office, Club, etc"
        />
        <Button
          disabled={!addressValid || isLoading}
          onClick={addAddressFun}
          additionalClassName={commonStyles.maxWidthButton}
        >
          Confirm delivery address
        </Button>
      </div>
    </BackablePageWithNavBar>
  );
};

export default AddAddressPage;
