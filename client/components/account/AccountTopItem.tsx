import Image from "next/image";
import logo from "../../assets/Icons/rabbit_logo.png";
import styles from "../../styles/Account.module.scss";

interface AccountTopItemProps {
  name: string;
  onEditClicked: () => void;
}

const AccountTopItem: React.FC<AccountTopItemProps> = (props) => {
  return (
    <div className={styles.topItemContainer}>
      <Image src={logo} width={60} height={60} />
      <div className={styles.topItemTextContainer}>
        <p className={styles.nameText}>{props.name}</p>
        <p onClick={props.onEditClicked} className={styles.editProfileText}>
          Edit profile
        </p>
      </div>
    </div>
  );
};

export default AccountTopItem;
