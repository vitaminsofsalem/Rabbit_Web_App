import { useRouter } from "next/router";
import React, { useContext } from "react";
import styles from "../styles/NavigationBar.module.scss";
import logoArt from "../assets/Icons/rabbit_logo.png";
import logoText from "../assets/Icons/rabbit_text_light.png";
import Image from "next/image";
import { NavigationBarList, ListItem } from "./NavigationBarList";
import AddressInfo from "./AddressInfo";
import { GlobalStateContext } from "../model/GlobalState";

const Greeter = (props: { name: String }) => (
  <div className={styles.greeterContainer}>
    <h1 className={styles.greet}> HELLO! </h1>
    <h1 className={styles.name}> {props.name} </h1>
  </div>
);

const navBarItems: ListItem[] = [
  {
    label: "Home",
    iconName: "house",
  },
  {
    label: "Search",
    iconName: "search",
  },
  {
    label: "Cart",
    iconName: "shoppingCart",
  },
  {
    label: "Favorites",
    iconName: "heart",
  },
  {
    label: "Account",
    iconName: "user",
  },
];

const Logo = () => (
  <>
    <div className={styles.logo}>
      <Image src={logoArt} width="67px" height="67px" />
    </div>
    <div className={styles.logo}>
      <Image src={logoText} width="121px" height="30px" />
    </div>
  </>
);

interface NavigationBarProps {
  onAddressClick: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = (props) => {
  const [globalState, setGlobalState] = useContext(GlobalStateContext);
  const router = useRouter();
  const currentPath = router.pathname;

  let activeLabel = "Home";
  if (currentPath.includes("/home")) {
    activeLabel = "Home";
  } else if (currentPath.includes("/search")) {
    activeLabel = "Search";
  } else if (currentPath.includes("/cart")) {
    activeLabel = "Cart";
  } else if (currentPath.includes("/favorites")) {
    activeLabel = "Favorites";
  } else if (currentPath.includes("/account")) {
    activeLabel = "Account";
  }

  const onNavItemClick = (label: string) => {
    if (label === "Home") {
      router.replace("/home");
    } else if (label === "Search") {
      router.replace("/search");
    } else if (label === "Cart") {
      router.replace("/cart");
    } else if (label === "Favorites") {
      router.replace("/favorites");
    } else if (label === "Account") {
      router.replace("/account");
    }
  };

  return (
    <div className={styles.navigationBar}>
      <Logo />
      <NavigationBarList
        items={navBarItems}
        activeLabel={activeLabel}
        onItemClick={onNavItemClick}
      />
      <AddressInfo onClick={props.onAddressClick} />
      <Greeter name={globalState.loggedInUserName?.split(" ")[0] || ""} />
    </div>
  );
};

export default NavigationBar;
