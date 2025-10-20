import React from 'react';
import Navigation from './Navigation';
import WalletItem from './WalletItem';
import Offer from './Offer';
import RefilledModal from '../refilled/RefilledModal';

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
    const [isTopUpOpen, setTopUpOpen] = React.useState(false);

    return (
        <div className="mt-[-2rem] bg-[var(--bg-optional)] rounded-t-[2rem] w-full h-full relative">
            <Offer />
            <Navigation onTopUp={() => setTopUpOpen(true)} />
            <RefilledModal isTopUpOpen={isTopUpOpen} setTopUpOpen={setTopUpOpen} />

            <div className="flex  gap-[1rem] flew-nowrap overflow-x-auto">
                {wallets?.map((item, index) => (
                    <WalletItem key={index} {...item} />
                ))}
            </div>
        </div>
    );
};

export default Wallets;
