import { RootState } from "../store";

const getTransferData = (state: RootState) => state.transfer ?? null;
const getTransferAdress = (state: RootState) => state.transfer.address;
const getTransferAmount = (state: RootState) => state.transfer.amount;
const getTransferNetwork = (state: RootState) => state.transfer.network;
const getTransferCrypto = (state: RootState) => state.transfer.crypto;

export {
    getTransferData,
    getTransferAdress,
    getTransferAmount,
    getTransferNetwork,
    getTransferCrypto,
};
