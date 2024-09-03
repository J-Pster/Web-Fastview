import React from "react";
import { Provider } from "react-redux";
import { trade_store } from "./TradeStore";

export const ReduxProvider = ({ children }: { children: React.ReactNode}) => {
  return <Provider store={trade_store}>{children}</Provider>;
};
