import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TransferState {
    currency: string;
    ammount: string;
    network: string;
    address: string;
    sucseccful: boolean | null;
}

const initialState: TransferState = {
    currency: "",
    ammount: "",
    network: "",
    address: "",
    sucseccful: null,
};

export const transferSlice = createSlice({
    name: "transfer",
    initialState: initialState,
    reducers: {
        setTransferAmount(state, action: PayloadAction<string>) {
            state.ammount = action.payload;
        },
        setTransferAddress(state, action: PayloadAction<string>) {
            state.address = action.payload;
        },
        setTransferNetwork(state, action: PayloadAction<string>) {
            state.network = action.payload;
        },
        setTransferCurrency(state, action: PayloadAction<string>) {
            state.currency = action.payload;
        },
        setTransferSucseccful(state, action: PayloadAction<boolean | null>) {
            state.sucseccful = action.payload;
        },
        resetTransfer(state) {
            state = { ...initialState };
        },
    },
});

export const {
    setTransferAmount,
    setTransferAddress,
    setTransferNetwork,
    setTransferCurrency,
    setTransferSucseccful,
    resetTransfer,
} = transferSlice.actions;

export default transferSlice.reducer;
