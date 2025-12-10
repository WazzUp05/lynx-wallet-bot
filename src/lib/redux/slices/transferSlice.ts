import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TransferState {
    crypto: string;
    amount: string;
    network: string;
    address: string;
    isSuccessful: boolean | null;
    isLoading: boolean;
    transactionId: string;
    error: string | null;
}

const initialState: TransferState = {
    crypto: "",
    amount: "",
    network: "",
    address: "",
    isSuccessful: null,
    isLoading: false,
    transactionId: "",
    error: null,
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
        setTransferIsSuccessful(state, action: PayloadAction<boolean | null>) {
            state.isSuccessful = action.payload;
        },
        setTransferIsLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setTransactionId(state, action: PayloadAction<string>) {
            state.transactionId = action.payload;
        },
        setTransferError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        resetTransfer(state) {
            Object.assign(state, initialState);
        },
    },
});

export const {
    setTransferAmount,
    setTransferAddress,
    setTransferNetwork,
    setTransferCrypto,
    setTransferIsSuccessful,
    setTransferIsLoading,
    setTransactionId,
    setTransferError,
    resetTransfer,
} = transferSlice.actions;

export default transferSlice.reducer;
