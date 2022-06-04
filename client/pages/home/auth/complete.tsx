import type { NextPage } from "next";
import router from "next/router";
import { useState } from "react";
import Button from "../../../components/common/Button";
import InputField from "../../../components/common/InputField";
import { BackablePageWithNavBar } from "../../../components/page_containers/BackablePageWithNavBar";
import styles from "../../../styles/Authentication.module.scss";
import commonStyles from "../../../styles/Common.module.scss";

//URL: /home/auth/complete

const AuthCompleteProfilePage: NextPage = () => {
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");

  const namesValid = firstName.length >= 2 && lastName.length >= 2;

  return (
    <BackablePageWithNavBar title="Complete your profile">
      <div className={styles.parentContainer}>
        <InputField
          label="First Name"
          value={firstName}
          onValueChange={setFirstname}
          placeholder="Enter first name"
        />

        <InputField
          label="Last Name"
          value={lastName}
          onValueChange={setLastname}
          placeholder="Enter last name"
        />
        <Button
          disabled={!namesValid}
          onClick={() => {
            router.replace("/home");
          }}
          additionalClassName={commonStyles.maxWidthButton}
        >
          Continue
        </Button>
      </div>
    </BackablePageWithNavBar>
  );
};

export default AuthCompleteProfilePage;
