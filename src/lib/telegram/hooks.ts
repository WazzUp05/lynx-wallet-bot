'use client'

import { useEffect, useState } from 'react'
import { TelegramWebApp, TelegramUser } from './types'

export function useTelegramWebApp() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Check if we're in Telegram WebApp environment
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      setWebApp(tg)
      setUser(tg.initDataUnsafe.user || null)
      
      // Ready the WebApp
      tg.ready()
      tg.expand()
      
      setIsReady(true)

      // Set theme colors to match our design
      tg.headerColor = '#8b5cf6'
      tg.backgroundColor = '#6366f1'
    } else {
      // For development/testing outside Telegram
      setIsReady(true)
    }
  }, [])

  return {
    webApp,
    user,
    isReady,
    isInTelegram: !!webApp,
  }
}

export function initTelegramWebApp() {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp
    tg.ready()
    tg.expand()
    return tg
  }
  return null
}