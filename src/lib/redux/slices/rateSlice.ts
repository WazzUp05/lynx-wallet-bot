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
    rate: Rate | null;
}

const initialState: RateState = {
    rate: null,
};

export const rateSlice = createSlice({
    name: "rate",
    initialState,
    reducers: {
        setRates(state, action: PayloadAction<Rate | null>) {
            state.rate = action.payload;
        },
    },
});

export const { setRates } = rateSlice.actions;
export default rateSlice.reducer;
