import { ReactNode } from "react";
import styles from "../../styles/Common.module.scss";

interface ButtonProps {
  children: ReactNode;
  color?: "green" | "yellow";
  additionalClassName?: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  color = "green",
  disabled = false,
  ...props
}) => {
  const colorClass =
    color === "green" ? styles.buttonGreen : styles.buttonYellow;
  return (
    <div
      onClick={props.onClick}
      className={`${styles.button} ${colorClass} ${props.additionalClassName} ${
        disabled ? styles.buttonDisabled : ""
      }`}
    >
      {props.children}
    </div>
  );
};

export default Button;
