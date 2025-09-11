import React from "react";
import Header from "./Header";
import Balance from "./Balance";
import Navigation from "./Navigation";
import Wallets from "./Wallets";
import RefilledModal from "../refilled/RefilledModal";

const WalletItemData = [
    {
        walletName: "USDT",
        walletIcon: "/icons/usdt.svg",
        fiatBalance: 1000,
        cryptoBalance: 0.5,
    },
    {
        walletName: "TON",
        walletIcon: "/icons/ton.svg",
        fiatBalance: 2000,
        cryptoBalance: 1.0,
    },
    {
        walletName: "BTC",
        walletIcon: "/icons/btc.svg",
        soon: true,
    },
];

const Main: React.FC = () => {
    const [isTopUpOpen, setTopUpOpen] = React.useState(false);
    return (
        <div className="w-full min-h-[100dvh] flex flex-col items-center  text-[var(--text)] pb-[var(--nav-bottom-height)]">
            <div className="px-[1.6rem] py-[2rem] w-full bg-[var(--blue)] pb-[4rem]">
                <Header avatar="/avatar.png" name="Conor_McGregor" />
                <Balance balance={1234.56} />
                <Navigation onTopUp={() => setTopUpOpen(true)} />
            </div>

            <Wallets wallets={WalletItemData} />
            <RefilledModal isTopUpOpen={isTopUpOpen} setTopUpOpen={setTopUpOpen} />
        </div>
    );
};

export default Main;
