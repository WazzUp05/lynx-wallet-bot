import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NetworkType = 'TRC20' | 'TON';

export type CryptoType = 'USDT' | 'BTC' | 'ETH' | 'TON';

export interface CryptoItem {
    description: string;
    iconUrl: string;
    id: CryptoType;
    label: CryptoType;
}
interface WalletState {
    balance: number;
    network: NetworkType;
    crypto: CryptoItem;
}

const initialState: WalletState = {
    balance: 0,
    network: 'TRC20',
    crypto: {
        description: '0.0 USDT',
        iconUrl: '/icons/usdt.svg',
        id: 'USDT',
        label: 'USDT',
    },
};

export const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setBalance(state, action: PayloadAction<number>) {
            state.balance = action.payload;
        },
        setNetwork(state, action: PayloadAction<NetworkType>) {
            state.network = action.payload;
        },
        setCrypto(state, action: PayloadAction<CryptoItem>) {
            state.crypto = action.payload;
        },
    },
});

export const { setBalance, setNetwork, setCrypto } = walletSlice.actions;
export default walletSlice.reducer;
