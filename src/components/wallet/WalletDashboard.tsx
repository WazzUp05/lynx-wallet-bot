'use client'

import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { connectWallet, disconnectWallet, addTransaction } from '@/lib/redux/slices/walletSlice'
import { setTelegramUser, setTelegramEnvironment, setReady } from '@/lib/redux/slices/telegramSlice'
import { useTelegramWebApp } from '@/lib/telegram/hooks'

interface Transaction {
  id: string
  type: 'send' | 'receive'
  amount: number
  timestamp: string
  from?: string
  to?: string
}

export default function WalletDashboard() {
  const { balance, isConnected, address, transactions } = useAppSelector((state) => state.wallet)
  const { user, isInTelegram } = useAppSelector((state) => state.telegram)
  const dispatch = useAppDispatch()
  const { user: telegramUser, isReady, isInTelegram: telegramEnv } = useTelegramWebApp()

  // Initialize Telegram WebApp integration
  useEffect(() => {
    if (isReady) {
      dispatch(setReady(true))
      dispatch(setTelegramEnvironment(telegramEnv))
      
      if (telegramUser) {
        dispatch(setTelegramUser(telegramUser))
      }
    }
  }, [isReady, telegramEnv, telegramUser, dispatch])

  const handleConnect = () => {
    const mockAddress = "0x" + Math.random().toString(16).substring(2, 10)
    const mockBalance = Math.floor(Math.random() * 1000) + 100
    dispatch(connectWallet({ address: mockAddress, balance: mockBalance }))
    
    // Add a mock transaction
    dispatch(addTransaction({
      id: Math.random().toString(36),
      type: 'receive',
      amount: 50,
      timestamp: new Date().toISOString(),
      from: '0x1234567890abcdef'
    }))
  }

  const handleDisconnect = () => {
    dispatch(disconnectWallet())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Lynx Wallet Bot
            </h1>
            <p className="text-purple-200">
              Telegram wallet bot powered by Next.js + TypeScript + Tailwind + Redux
            </p>
            {user && (
              <div className="mt-4 bg-white/10 backdrop-blur-lg rounded-lg p-3 inline-block">
                <p className="text-white text-sm">
                  Welcome, <span className="font-semibold">{user.first_name}</span>
                  {user.last_name && ` ${user.last_name}`}
                  {user.username && ` (@${user.username})`}
                </p>
                <p className="text-purple-200 text-xs mt-1">
                  {isInTelegram ? 'Running in Telegram' : 'Development Mode'}
                </p>
              </div>
            )}
          </div>

          {/* Wallet Status Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-white">
                Wallet Status
              </h2>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isConnected 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>

            {isConnected ? (
              <div className="space-y-4">
                <div>
                  <p className="text-purple-200 mb-1">Address:</p>
                  <p className="text-white font-mono text-sm bg-black/20 px-3 py-2 rounded">
                    {address}
                  </p>
                </div>
                <div>
                  <p className="text-purple-200 mb-1">Balance:</p>
                  <p className="text-3xl font-bold text-white">
                    {balance} TON
                  </p>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Disconnect Wallet
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-purple-200 mb-4">
                  Connect your wallet to get started
                </p>
                <button
                  onClick={handleConnect}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </div>

          {/* Transactions */}
          {isConnected && transactions.length > 0 && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">
                Recent Transactions
              </h3>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx: Transaction) => (
                  <div
                    key={tx.id}
                    className="flex justify-between items-center bg-black/20 rounded-lg p-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${
                          tx.type === 'receive' ? 'bg-green-400' : 'bg-red-400'
                        }`}></span>
                        <span className="text-white font-medium capitalize">
                          {tx.type}
                        </span>
                      </div>
                      <p className="text-purple-200 text-sm">
                        {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        tx.type === 'receive' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {tx.type === 'receive' ? '+' : '-'}{tx.amount} TON
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack Info */}
          <div className="mt-8 text-center">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-3">
                Tech Stack
              </h4>
              <div className="flex flex-wrap justify-center gap-3">
                {['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'React 19'].map((tech) => (
                  <span
                    key={tech}
                    className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm border border-purple-500/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}