import type { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import { BackablePageWithNavBar } from "../../components/page_containers/BackablePageWithNavBar";
import styles from "../../styles/FormPage.module.scss";
import commonStyles from "../../styles/Common.module.scss";
import router from "next/router";
import { toast } from "react-toastify";
import { GlobalStateContext } from "../../model/GlobalState";
import { updateName } from "../../remote/user";

//URL: /account/edit

const EditAccountPage: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [globalState, setGlobalState] = useContext(GlobalStateContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const namesValid = firstName.length >= 2 && lastName.length >= 2;

  const setName = () => {
    setIsLoading(true);
    toast
      .promise(updateName(`${firstName} ${lastName}`), {
        pending: "Updating name",
        error: "Failed to update name, please try again",
        success: "Name updated",
      })
      .then(() => {
        setGlobalState({
          ...globalState,
          loggedInUserName: `${firstName} ${lastName}`,
        });
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const splitName = globalState.loggedInUserName?.split(" ");

    setFirstName(splitName?.at(0) || "");
    setLastName(splitName?.at(1) || "");
  }, [globalState.loggedInUserName]);

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

        {/* <InputField
          label="Email"
          value={"youssef.hisham14@gmail.com"}
          onValueChange={() => {}}
          disabled
          placeholder=""
        /> */}

        <Button
          disabled={!namesValid || isLoading}
          onClick={setName}
          additionalClassName={commonStyles.maxWidthButton}
        >
          Update profile
        </Button>
      </div>
    </BackablePageWithNavBar>
  );
};

export default EditAccountPage;
