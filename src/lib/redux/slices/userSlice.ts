import { TelegramUser } from '@/lib/telegram/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Wallet {
  id: number;
  network: string;
  address: string;
  balance: number;
  balance_usdt: number;
  created_at: string;
}

export interface UserProp extends TelegramUser {
  id: number;
  name: string;
  telegram_id: string;
  first_name: string;
  last_name: string;
  username: string;
  photo_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  wallet?: Wallet;
}

interface UserState {
  data: UserProp | null;
  loading: boolean;
}

const initialState: UserState = {
  data: null,
  loading: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProp>) => {
      state.data = action.payload;
    },
    clearUser: (state) => {
      state.data = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
