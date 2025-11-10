# Lynx Wallet Bot

A modern Telegram wallet bot built with Next.js, TypeScript, Tailwind CSS, and Redux Toolkit.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 15, TypeScript, Tailwind CSS, and Redux Toolkit
- **Telegram WebApp Integration**: Ready for Telegram Mini App deployment
- **Wallet Management**: Connect/disconnect wallet functionality with state management
- **Transaction History**: Display recent transactions
- **Responsive Design**: Beautiful gradient UI with glassmorphism effects
- **Type Safety**: Full TypeScript support throughout the application
- **State Management**: Centralized state with Redux Toolkit

## 🛠 Tech Stack

- **Frontend Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **UI Components**: Custom React components
- **Telegram Integration**: Telegram WebApp API

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/WazzUp05/lynx-wallet-bot.git
cd lynx-wallet-bot
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗 Build

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## 🧹 Code Quality

Run ESLint to check code quality:

```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── wallet/           # Wallet-related components
│       └── WalletDashboard.tsx
├── lib/                  # Utilities and configurations
│   ├── providers/        # React providers
│   │   └── ReduxProvider.tsx
│   ├── redux/           # Redux store and slices
│   │   ├── store/       # Store configuration
│   │   ├── slices/      # Redux slices
│   │   └── hooks.ts     # Typed Redux hooks
│   └── telegram/        # Telegram WebApp integration
│       ├── types.ts     # TypeScript types
│       └── hooks.ts     # Telegram hooks
```

## 🔧 Development

### Redux Store

The application uses Redux Toolkit for state management with two main slices:

- **Wallet Slice**: Manages wallet connection, balance, and transactions
- **Telegram Slice**: Manages Telegram user data and environment

### Telegram Integration

The app is ready for Telegram WebApp deployment with:

- Telegram WebApp API integration
- User data handling
- Environment detection (Telegram vs. development)
- Theme integration

### Component Architecture

- **WalletDashboard**: Main component handling wallet state and UI
- **ReduxProvider**: Wraps the app with Redux store
- Modular design with reusable components

## 🚀 Deployment

### For Telegram Bot

1. Build the application:

```bash
npm run build
```

2. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

3. Configure your Telegram bot to use the deployed URL as a WebApp

### Environment Variables

Create a `.env.local` file for local development:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📱 Telegram WebApp Features

- Automatic detection of Telegram environment
- User data integration from Telegram
- Theme synchronization with Telegram
- Responsive design optimized for mobile

## 🎨 UI/UX

- Beautiful gradient background (purple to blue)
- Glassmorphism effects with backdrop blur
- Responsive design for all screen sizes
- Smooth transitions and hover effects
- Status indicators for wallet connection
- Transaction history with visual indicators

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Issues

If you encounter any issues, please create an issue on GitHub.
