import { RootState } from "../store";

const getTransferData = (state: RootState) => state.transfer ?? null;
const getTransferAdress = (state: RootState) => state.transfer.address;
const getTransferAmount = (state: RootState) => state.transfer.amount;
const getTransferNetwork = (state: RootState) => state.transfer.network;
const getTransferCrypto = (state: RootState) => state.transfer.crypto;
const getTransferIsLoading = (state: RootState) => state.transfer.isLoading;
const getTransferError = (state: RootState) => state.transfer.error;
const getTransferIsSuccessful = (state: RootState) => state.transfer.isSuccessful;
const getTransactionId = (state: RootState) => state.transfer.transactionId;

export {
    getTransferData,
    getTransferAdress,
    getTransferAmount,
    getTransferNetwork,
    getTransferCrypto,
    getTransferIsLoading,
    getTransferError,
    getTransferIsSuccessful,
    getTransactionId,
};
