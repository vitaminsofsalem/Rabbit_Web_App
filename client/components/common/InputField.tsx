import styles from "../../styles/Common.module.scss";

interface InputFieldProps {
  type?: "text" | "email" | "password";
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type = "text",
  disabled = false,
  ...props
}) => {
  return (
    <div
      className={`${styles.inputFieldContainer} ${
        disabled ? styles.inputFieldContainerDisabled : ""
      }`}
    >
      <label className={styles.inputLabel}>{props.label}</label>
      <input
        className={styles.input}
        type={type}
        value={props.value}
        onChange={(e) => props.onValueChange(e.target.value)}
      />
    </div>
  );
};

export default InputField;
