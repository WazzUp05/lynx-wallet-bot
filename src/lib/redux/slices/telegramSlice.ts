import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TelegramUser } from '../../telegram/types'

interface TelegramState {
  user: TelegramUser | null
  isInTelegram: boolean
  theme: 'light' | 'dark'
  isReady: boolean
}

const initialState: TelegramState = {
  user: null,
  isInTelegram: false,
  theme: 'dark',
  isReady: false,
}

export const telegramSlice = createSlice({
  name: 'telegram',
  initialState,
  reducers: {
    setTelegramUser: (state, action: PayloadAction<TelegramUser | null>) => {
      state.user = action.payload
    },
    setTelegramEnvironment: (state, action: PayloadAction<boolean>) => {
      state.isInTelegram = action.payload
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    setReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload
    },
  },
})

export const { setTelegramUser, setTelegramEnvironment, setTheme, setReady } = telegramSlice.actions
export default telegramSlice.reducer