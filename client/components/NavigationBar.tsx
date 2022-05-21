import { useRouter } from "next/router";
import React from "react";

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

  return <div />;
};

export default NavigationBar;
