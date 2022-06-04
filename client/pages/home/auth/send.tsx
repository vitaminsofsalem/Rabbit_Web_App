import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "../../../components/common/Button";
import InputField from "../../../components/common/InputField";
import { BackablePageWithNavBar } from "../../../components/page_containers/BackablePageWithNavBar";
import styles from "../../../styles/Authentication.module.scss";
import commonStyles from "../../../styles/Common.module.scss";

//URL: /home/auth/send

const AuthSendVerificationPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const emailValid = validateEmail(email);

  return (
    <BackablePageWithNavBar isLoginProtected={false} title="Authentication">
      <div className={styles.parentContainer}>
        <p className={styles.descriptionText}>
          You will recieve an email with a verification code. If this is your
          first time, an account will be automatically created. Otherwise, you
          will be logged in to your previous account.
        </p>
        <InputField
          label="Email"
          value={email}
          onValueChange={setEmail}
          placeholder="Enter email"
        />
        <Button
          disabled={!emailValid}
          onClick={() => {
            router.push("/home/auth/" + email);
          }}
          additionalClassName={commonStyles.maxWidthButton}
        >
          Send code
        </Button>
      </div>
    </BackablePageWithNavBar>
  );
};

export default AuthSendVerificationPage;
