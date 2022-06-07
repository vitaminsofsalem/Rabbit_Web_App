import "../styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { GlobalState, GlobalStateContext } from "../model/GlobalState";
import { ToastContainer } from "react-toastify";
import { getAddresses, getCart, getFavorites, getName } from "../remote/user";

function MyApp({ Component, pageProps }: AppProps) {
  const [globalState, setGlobalState] = useState<GlobalState>({
    cart: [],
    isLoggedIn: true,
    selectedAddress: undefined,
    loggedInUserName: undefined,
    addresses: [],
    favorites: [],
  });

  const fillInitialData = async () => {
    const isLoggedIn = !!localStorage.getItem("token");
    if (globalState.isLoggedIn != isLoggedIn) {
      setGlobalState({
        ...globalState,
        isLoggedIn,
      });
    }

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

      const favorites = await getFavorites().catch((e) =>
        console.error("Favorites failed to get")
      );
      setGlobalState({
        ...globalState,
        isLoggedIn,
        loggedInUserName: name || "",
        cart: cart ? cart.cart : [],
        addresses: addresses ? addresses.addresses : [],
        selectedAddress:
          addresses && addresses.addresses ? addresses.addresses[0] : undefined,
        favorites: favorites ? favorites.favorites.map((item) => item.id) : [],
      });
    }
  };

  useEffect(() => {
    fillInitialData();
  }, [globalState.isLoggedIn]);

  return (
    <GlobalStateContext.Provider value={[globalState, setGlobalState]}>
      <Component {...pageProps} />
      <ToastContainer position="bottom-right" />
    </GlobalStateContext.Provider>
  );
}

export default MyApp;
