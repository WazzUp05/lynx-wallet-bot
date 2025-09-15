import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Rate {
    id: number;
    symbol: string;
    name: string;
    amount: number;
    last_updated: string;
    quote: {
        RUB: {
            price: number;
            last_updated: string;
        };
    };
}

interface RateState {
    rates: Rate[];
}

const initialState: RateState = {
    rates: [],
};

export const rateSlice = createSlice({
    name: "rate",
    initialState,
    reducers: {
        setRates(state, action: PayloadAction<Rate[]>) {
            state.rates = action.payload;
        },
    },
});

export const { setRates } = rateSlice.actions;
export default rateSlice.reducer;
