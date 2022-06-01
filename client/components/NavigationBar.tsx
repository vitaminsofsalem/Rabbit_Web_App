import { useRouter } from "next/router";
import React from "react";
import styles from "../styles/NavigationBar.module.scss";
import logoArt from "../assets/Icons/rabbit_logo.png";
import logoText from "../assets/Icons/rabbit_text_light.png";
import Image from "next/image";
import { NavigationBarList, ListItem } from "./NavigationBarList";
import AddressInfo from "./AddressInfo";

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

const NavigationBar: React.FC = () => {
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
      <AddressInfo />
      <Greeter name="Smith" />
    </div>
  );
};

export default NavigationBar;
