import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import TradeSlice from "./Slices/TradeSlice";
import TradeGerenciadorSlice from "./Slices/TradeGerenciadorSlice";

export const trade_store = configureStore({
  reducer: {
    trade: combineSlices({
      main: TradeSlice,
      gerenciador: TradeGerenciadorSlice,
    }),
  },
  devTools: true,
});

export type RootState = ReturnType<typeof trade_store.getState>;
export type AppDispatch = typeof trade_store.dispatch;
export const useTradeDispatch = useDispatch.withTypes<AppDispatch>();
export const useTradeSelector = useSelector.withTypes<RootState>();
