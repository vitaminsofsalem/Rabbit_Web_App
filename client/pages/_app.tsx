import "../styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import { GlobalState, GlobalStateContext } from "../model/GlobalState";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }: AppProps) {
  const [globalState, setGlobalState] = useState<GlobalState>({
    cart: [],
    isLoggedIn: false,
    selectedAddress: undefined,
    loggedInUserName: undefined,
    addresses: [
      {
        buildingNumber: "227",
        city: "Cairo",
        neighbourhood: "Yasmine 5",
        nickname: "Home",
        street: "Youssef St",
      },
      {
        buildingNumber: "M.212",
        city: "Cairo",
        neighbourhood: "New Adminstrtive Capital",
        nickname: "Work",
        street: "GIU St",
      },
    ],
  });

  return (
    <GlobalStateContext.Provider value={[globalState, setGlobalState]}>
      <Component {...pageProps} />
      <ToastContainer position="bottom-right" />
    </GlobalStateContext.Provider>
  );
}

export default MyApp;
