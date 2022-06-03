import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { useState } from "react";
import { GlobalState, GlobalStateContext } from "../model/GlobalState";

function MyApp({ Component, pageProps }: AppProps) {
  const [globalState, setGlobalState] = useState<GlobalState>({
    cart: [],
    isLoggedIn: false,
    selectedAddress: undefined,
    loggedInUserName: undefined,
  });

  return (
    <GlobalStateContext.Provider value={[globalState, setGlobalState]}>
      <Component {...pageProps} />;
    </GlobalStateContext.Provider>
  );
}

export default MyApp;
