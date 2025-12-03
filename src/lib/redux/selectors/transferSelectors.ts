import { RootState } from "../store";

const getTransferData = (state: RootState) => state.transfer ?? null;
const getTransferAdress = (state: RootState) => state.transfer.address;
const getTransferAmount = (state: RootState) => state.transfer.ammount;
const getTransferNetwork = (state: RootState) => state.transfer.network;
const getTransferCurrency = (state: RootState) => state.transfer.currency;

export {
    getTransferData,
    getTransferAdress,
    getTransferAmount,
    getTransferNetwork,
    getTransferCurrency,
};
