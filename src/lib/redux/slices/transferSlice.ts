import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TransferState {
    crypto: string;
    amount: string;
    network: string;
    address: string;
    sucseccful: boolean | null;
    isLoading: boolean;
}

const initialState: TransferState = {
    crypto: "",
    amount: "",
    network: "",
    address: "",
    sucseccful: null,
    isLoading: false,
};

export const transferSlice = createSlice({
    name: "transfer",
    initialState: initialState,
    reducers: {
        setTransferAmount(state, action: PayloadAction<string>) {
            state.amount = action.payload;
        },
        setTransferAddress(state, action: PayloadAction<string>) {
            state.address = action.payload;
        },
        setTransferNetwork(state, action: PayloadAction<string>) {
            state.network = action.payload;
        },
        setTransferCrypto(state, action: PayloadAction<string>) {
            state.crypto = action.payload;
        },
        setTransferSucseccful(state, action: PayloadAction<boolean | null>) {
            state.sucseccful = action.payload;
        },
        setTransferIsLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
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
    setTransferCrypto,
    setTransferSucseccful,
    setTransferIsLoading,
    resetTransfer,
} = transferSlice.actions;

export default transferSlice.reducer;
