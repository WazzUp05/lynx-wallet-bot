'use client';

import { useEffect } from 'react';
import { mockTelegramEnv, isTMA } from '@telegram-apps/sdk-react';

export default function TelegramInit({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      mockTelegramEnv({
        launchParams: {
          tgWebAppPlatform: 'tdesktop',
          tgWebAppVersion: '7.0',
          tgWebAppThemeParams: {
            bg_color: '#ffffff',
            text_color: '#000000',
          },
          tgWebAppData: new URLSearchParams(
            'user=%7B%22id%22%3A12345%2C%22first_name%22%3A%22DevUser%22%7D'
          ),
        },
      });
    }

    if (isTMA()) {
      window.Telegram?.WebApp?.ready();
    }
  }, []);

  return <>{children}</>;
}
