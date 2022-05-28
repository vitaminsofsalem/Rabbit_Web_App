import { useRouter } from "next/router";
import React from "react";
import classes from "../styles/NavigationBar.module.scss";
import logoArt from "../assets/Icons/rabbit_logo.png";
import logoText from "../assets/Icons/rabbit_text_light.png";
import Image from "next/image";
import NavigationBarList from "./NavigationBarList";

const Logo = () => (
  <>
    <div className={classes.logo}>
      <Image src={logoArt} width="67px" height="67px" />
    </div>
    <div className={classes.logo}>
      <Image src={logoText} width="121px" height="30px" />
    </div>
  </>
);

const NavigationBar: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  /**
   * Use the 'currentPath' to decide which item is selected.
   * Ex: If it contains /home then home item should be selected. Should also match /home/auth, /home/category/new etc.
   * Same for others /search, /cart, /account, /favorites
   */

  /**
   * router.replace("/home") for changing the page based on click
   */

  return (
    <div className={classes.navigationBar}>
      <Logo />
      <br />
      <br />
      <NavigationBarList />
    </div>
  );
};

export default NavigationBar;
