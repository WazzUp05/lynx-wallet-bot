import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    id: string | null;
    name: string | null;
    email: string | null;
    isAuthenticated: boolean;
    balance: {
        usdt: number;
        btc: number;
        eth: number;
        ton: number;
    };
}

const initialState: UserState = {
    id: null,
    name: null,
    email: null,
    isAuthenticated: false,
    balance: {
        usdt: 0,
        btc: 0,
        eth: 0,
        ton: 0,
    },
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<{ id: string; name: string; email: string }>) {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.isAuthenticated = true;
        },
        setBalance(state, action: PayloadAction<{ usdt: number; btc: number; eth: number; ton: number }>) {
            state.balance = action.payload;
        },
        clearUser(state) {
            state.id = null;
            state.name = null;
            state.email = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
