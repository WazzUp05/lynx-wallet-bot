import React from 'react';
import Navigation from './Navigation';
import WalletItem from './WalletItem';
import Offer from './Offer';
import RefilledModal from '../refilled/RefilledModal';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { getHistory } from '@/lib/redux/selectors/historySelectors';
import { getWallet } from '@/lib/redux/selectors/userSelectors';
import { setOnboardingToStep5 } from '@/lib/redux/slices/appSlice';

interface WalletItemDataProps {
    walletName?: string;
    walletIcon?: string;
    fiatBalance?: number;
    cryptoBalance?: number;
    soon?: boolean;
    rate?: number | null;
    rateChange?: number | null;
}

interface WalletsProps {
    wallets: WalletItemDataProps[];
}

const Wallets = ({ wallets }: WalletsProps) => {
    const dispatch = useAppDispatch();
    const [isTopUpOpen, setTopUpOpen] = React.useState(false);
    const history = useAppSelector(getHistory);
    const wallet = useAppSelector(getWallet);

    // Функция для проверки условий: нет истории и баланс 0
    const shouldShowOnboarding = () => {
        const hasBalance = wallet?.balance_usdt && wallet.balance_usdt > 0;
        const hasHistory = history && history.length > 0;
        return !hasBalance && !hasHistory;
    };

    // Обработчик клика на кнопку "Пополнить"
    const handleTopUp = () => {
        if (shouldShowOnboarding()) {
            // Если нет истории и баланс 0 - открываем онбординг на 5-м шаге
            dispatch(setOnboardingToStep5());
        } else {
            // Иначе открываем обычное модальное окно пополнения
            setTopUpOpen(true);
        }
    };

    return (
        <div className="pt-[1.6rem] bg-[var(--bg-optional)] rounded-t-[2rem] w-full h-full relative">
            <Offer />
            <Navigation onTopUp={handleTopUp} />
            <RefilledModal isTopUpOpen={isTopUpOpen} setTopUpOpen={setTopUpOpen} />

            <div className="flex mb-[2rem] gap-[1.6rem] flew-nowrap overflow-x-auto no-scrollbar">
                {wallets?.map((item, index) => (
                    <WalletItem key={index} {...item} />
                ))}
            </div>
        </div>
    );
};

export default Wallets;
