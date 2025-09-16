import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HistoryItem {
    id: number;
    type: string;
    amount: number;
    sent_amount: number;
    commission: number;
    transaction_hash: string;
    transaction_id: string;
    receiver: string;
    status: string;
    merchant_id: number;
    created_at: string;
    updated_at: string;
}

interface HistoryState {
    items: HistoryItem[];
}

const initialState: HistoryState = {
    items: [],
};

const historySlice = createSlice({
    name: "history",
    initialState,
    reducers: {
        setHistory(state, action: PayloadAction<HistoryItem[]>) {
            state.items = action.payload;
        },
    },
});

export const { setHistory } = historySlice.actions;

export default historySlice.reducer;
