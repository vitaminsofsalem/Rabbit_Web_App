import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "../../../components/common/Button";
import InputField from "../../../components/common/InputField";
import { BackablePageWithNavBar } from "../../../components/page_containers/BackablePageWithNavBar";
import {
  sendVerificationEmail,
  verifyVerificationCode,
} from "../../../remote/auth";
import styles from "../../../styles/Authentication.module.scss";
import commonStyles from "../../../styles/Common.module.scss";
import { toast } from "react-toastify";

//URL: /home/auth/{email}

const AuthVerifyCodePage: NextPage = () => {
  const router = useRouter();
  const { email } = router.query;
  const [code, setCode] = useState("");
  const codeValid = code.length === 6;
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  const verifyCode = () => {
    setIsLoading(true);
    toast
      .promise(verifyVerificationCode(email as string, code), {
        pending: "Verifying code",
        error: "Failed to verify code, please try again",
      })
      .then((res) => {
        if (res.verified && res.access_token) {
          localStorage.setItem("token", res.access_token);
          router.replace("/home/auth/complete");
        } else {
          toast.error("Incorrect verification code");
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const sendEmail = () => {
    if (!isResendingEmail) {
      setIsResendingEmail(true);
      toast
        .promise(sendVerificationEmail(email as string), {
          pending: "Sending verification email",
          error: "Failed to send verfication email, please try again",
          success: "Verfication code resent",
        })
        .then(() => setIsResendingEmail(false))
        .catch(() => setIsResendingEmail(false));
    }
  };

  return (
    <BackablePageWithNavBar isLoginProtected={false} title="Authentication">
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
          disabled={!codeValid || isLoading}
          onClick={verifyCode}
          additionalClassName={commonStyles.maxWidthButton}
        >
          Verify
        </Button>
        <p className={styles.resendText}>
          Didn't receive a code?{" "}
          <span onClick={sendEmail} className={styles.resendButton}>
            Resend it
          </span>
        </p>
      </div>
    </BackablePageWithNavBar>
  );
};

export default AuthVerifyCodePage;
