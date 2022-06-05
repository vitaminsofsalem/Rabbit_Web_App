import "../styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { GlobalState, GlobalStateContext } from "../model/GlobalState";
import { ToastContainer } from "react-toastify";
import { getAddresses, getCart, getName } from "../remote/user";

function MyApp({ Component, pageProps }: AppProps) {
  const [globalState, setGlobalState] = useState<GlobalState>({
    cart: [],
    isLoggedIn: false,
    selectedAddress: undefined,
    loggedInUserName: undefined,
    addresses: [],
  });

  const fillInitialData = async () => {
    const isLoggedIn = !!localStorage.getItem("token");

    if (isLoggedIn) {
      const name = await getName().catch((e) =>
        console.error("Name failed to get")
      );
      const cart = await getCart().catch((e) =>
        console.error("Cart failed to get")
      );

      const addresses = await getAddresses().catch((e) =>
        console.error("Address failed to get")
      );
      setGlobalState({
        ...globalState,
        isLoggedIn,
        loggedInUserName: name || "",
        cart: cart ? cart.cart : [],
        addresses: addresses ? addresses.addresses : [],
      });
    } else {
      setGlobalState({
        ...globalState,
        isLoggedIn,
      });
    }
  };

  useEffect(() => {
    fillInitialData();
  }, []);

  return (
    <GlobalStateContext.Provider value={[globalState, setGlobalState]}>
      <Component {...pageProps} />
      <ToastContainer position="bottom-right" />
    </GlobalStateContext.Provider>
  );
}

export default MyApp;
