import React, { useCallback, useEffect } from 'react';
import Header from './Header';
import Balance from './Balance';
import Wallets from './Wallets';
import RefilledModal from '../refilled/RefilledModal';
import { getUser, getWallet } from '@/lib/redux/selectors/userSelectors';
import { useAppSelector } from '@/lib/redux/hooks';
import { getRatesQuoteRub, getRatesPercentChange24h } from '@/lib/redux/selectors/rateSelectors';
import { getShouldDisableButtons } from '@/lib/redux/selectors/appSelectors';

const Main: React.FC = () => {
    const { data: user } = useAppSelector(getUser);
    const wallet = useAppSelector(getWallet);
    const rate = useAppSelector(getRatesQuoteRub);
    const rateChange = useAppSelector(getRatesPercentChange24h);
    const [isTopUpOpen, setTopUpOpen] = React.useState(false);
    const shouldDisableButtons = useAppSelector(getShouldDisableButtons);

    const balance_usdt = useCallback(() => wallet?.balance_usdt, [wallet])();
    const convertedBalance = balance_usdt && rate ? Number((balance_usdt * rate).toFixed(2)) : 0;

    const walletItemData = [
        {
            walletName: 'USDT',
            walletIcon: shouldDisableButtons ? '/icons/usdt-gray.svg' : '/icons/usdt.svg',
            fiatBalance: convertedBalance ?? 0,
            cryptoBalance: wallet?.balance_usdt ?? 0,
            rate: rate,
            rateChange: rateChange,
        },
        {
            walletName: 'TON',
            walletIcon: '/icons/ton-gray.svg',
            soon: true,
        },
        {
            walletName: 'BTC',
            walletIcon: '/icons/btc-gray.svg',
            soon: true,
        },
        {
            walletName: 'ETH',
            walletIcon: '/icons/eth-gray.svg',
            soon: true,
        },
    ];

    return (
        <div className="w-full min-h-[100dvh] flex flex-col items-center pb-[calc(var(--safe-bottom)+1rem+var(--nav-bottom-height)))]  text-[var(--text)] ">
            <div className="px-[1.6rem] pb-0 py-[2rem] w-full bg-[var(--bg-main)] relative">
                <div className="bg-[#ffffff29]  rounded-full w-[20rem] h-[20rem] blur-[11rem] absolute top-[2.8rem] left-1/2 -translate-x-1/2 "></div>
                <Header name={user ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}` : '...'} />
                <Balance balance={balance_usdt || 0} />
            </div>

            <Wallets wallets={walletItemData} />
            <RefilledModal isTopUpOpen={isTopUpOpen} setTopUpOpen={setTopUpOpen} />
        </div>
    );
};

export default Main;
