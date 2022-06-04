import type { NextPage } from "next";
import { useState } from "react";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import { BackablePageWithNavBar } from "../../components/page_containers/BackablePageWithNavBar";
import styles from "../../styles/FormPage.module.scss";
import commonStyles from "../../styles/Common.module.scss";

//URL: /account/edit

const EditAccountPage: NextPage = () => {
  const [firstName, setFirstName] = useState("Youssef");
  const [lastName, setLastName] = useState("Henna");

  const namesValid = firstName.length >= 2 && lastName.length >= 2;

  return (
    <BackablePageWithNavBar title="Edit Profile">
      <div className={styles.parentContainer}>
        <InputField
          label="First Name"
          value={firstName}
          onValueChange={setFirstName}
          placeholder="Enter first name"
        />
        <InputField
          label="Last Name"
          value={lastName}
          onValueChange={setLastName}
          placeholder="Enter last name"
        />

        <InputField
          label="Email"
          value={"youssef.hisham14@gmail.com"}
          onValueChange={() => {}}
          disabled
          placeholder=""
        />

        <Button
          disabled={!namesValid}
          onClick={() => {}}
          additionalClassName={commonStyles.maxWidthButton}
        >
          Update profile
        </Button>
      </div>
    </BackablePageWithNavBar>
  );
};

export default EditAccountPage;
