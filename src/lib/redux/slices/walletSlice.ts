import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface WalletState {
  balance: number
  isConnected: boolean
  address: string | null
  transactions: Transaction[]
}

interface Transaction {
  id: string
  type: 'send' | 'receive'
  amount: number
  timestamp: string
  from?: string
  to?: string
}

const initialState: WalletState = {
  balance: 0,
  isConnected: false,
  address: null,
  transactions: [],
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    connectWallet: (state, action: PayloadAction<{ address: string; balance: number }>) => {
      state.isConnected = true
      state.address = action.payload.address
      state.balance = action.payload.balance
    },
    disconnectWallet: (state) => {
      state.isConnected = false
      state.address = null
      state.balance = 0
      state.transactions = []
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload)
    },
  },
})

export const { connectWallet, disconnectWallet, updateBalance, addTransaction } = walletSlice.actions
export default walletSlice.reducer