import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "../../../components/common/Button";
import InputField from "../../../components/common/InputField";
import { BackablePageWithNavBar } from "../../../components/page_containers/BackablePageWithNavBar";
import styles from "../../../styles/Authentication.module.scss";
import commonStyles from "../../../styles/Common.module.scss";

//URL: /home/auth/{email}

const AuthVerifyCodePage: NextPage = () => {
  const router = useRouter();
  const { email } = router.query;
  const [code, setCode] = useState("");
  const codeValid = code.length === 6;

  return (
    <BackablePageWithNavBar title="Authentication">
      <div className={styles.parentContainer}>
        <p className={styles.descriptionText}>
          A 6 digit code has been sent to your email address. Please enter it
          below to verify your email.
        </p>
        <p className={styles.emailText}>{email}</p>
        <InputField
          label="Security code"
          value={code}
          onValueChange={setCode}
          placeholder="Enter your code"
        />
        <Button
          disabled={!codeValid}
          onClick={() => {
            router.replace("/home/auth/complete");
          }}
          additionalClassName={commonStyles.maxWidthButton}
        >
          Verify
        </Button>
        <p className={styles.resendText}>
          Didn't receive a code?{" "}
          <span className={styles.resendButton}>Resend it</span>
        </p>
      </div>
    </BackablePageWithNavBar>
  );
};

export default AuthVerifyCodePage;
