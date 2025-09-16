import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    photo_url?: string;
}

interface UserState {
    data: TelegramUser | null;
    loading: boolean;
}

const initialState: UserState = {
    data: null,
    loading: true,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<TelegramUser>) => {
            state.data = action.payload;
            state.loading = false;
        },
        clearUser: (state) => {
            state.data = null;
            state.loading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
