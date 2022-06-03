import React from "react";
import { Address } from "./Address";
import { OrderCartProduct } from "./Product";

export const GlobalStateContext = React.createContext<
  [currentState: GlobalState, updateState: (newState: GlobalState) => void]
>([
  {
    cart: [],
    isLoggedIn: false,
    selectedAddress: undefined,
    loggedInUserName: undefined,
  },
  () => {},
]);

export interface GlobalState {
  cart: OrderCartProduct[];
  selectedAddress?: Address;
  isLoggedIn: boolean;
  loggedInUserName?: string;
}