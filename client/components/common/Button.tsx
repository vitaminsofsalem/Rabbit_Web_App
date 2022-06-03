import { ReactNode } from "react";
import styles from "../../styles/Common.module.scss";

interface ButtonProps {
  children: ReactNode;
  color?: "green" | "yellow";
  additionalClassName?: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ color = "green", ...props }) => {
  const colorClass =
    color === "green" ? styles.buttonGreen : styles.buttonYellow;
  return (
    <div
      onClick={props.onClick}
      className={`${styles.button} ${colorClass} ${props.additionalClassName}`}
    >
      {props.children}
    </div>
  );
};

export default Button;
