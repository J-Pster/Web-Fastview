import { createSlice } from "@reduxjs/toolkit";

const initialState = {

}

const TradeSlice = createSlice({
  initialState,
  name: "trade-slice",
  reducers: {
    resetState: () => initialState,
  },
});

export const TradeActions = TradeSlice.actions;
export default TradeSlice.reducer;