import { RootState } from "../store";

const getNetworkType = (state: RootState) => state.wallet.network;
const getBalance = (state: RootState) => state.wallet.balance;
const getCrypto = (state: RootState) => state.wallet.crypto;

export { getNetworkType, getBalance, getCrypto };
