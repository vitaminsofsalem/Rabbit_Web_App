import type { NextPage } from "next";
import router from "next/router";
import { useContext, useState } from "react";
import Button from "../../../components/common/Button";
import InputField from "../../../components/common/InputField";
import { BackablePageWithNavBar } from "../../../components/page_containers/BackablePageWithNavBar";
import styles from "../../../styles/Authentication.module.scss";
import commonStyles from "../../../styles/Common.module.scss";
import { toast } from "react-toastify";
import { updateName } from "../../../remote/user";
import { GlobalStateContext } from "../../../model/GlobalState";

//URL: /home/auth/complete

const AuthCompleteProfilePage: NextPage = () => {
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [globalState, setGlobalState] = useContext(GlobalStateContext);

  const namesValid = firstName.length >= 2 && lastName.length >= 2;

  const setName = () => {
    setIsLoading(true);
    toast
      .promise(updateName(`${firstName} ${lastName}`), {
        pending: "Updating name",
        error: "Failed to update name, please try again",
      })
      .then(() => {
        router.replace("/home");
        setGlobalState({
          ...globalState,
          loggedInUserName: `${firstName} ${lastName}`,
        });
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

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
          disabled={!namesValid || isLoading}
          onClick={setName}
          additionalClassName={commonStyles.maxWidthButton}
        >
          Continue
        </Button>
      </div>
    </BackablePageWithNavBar>
  );
};

export default AuthCompleteProfilePage;
