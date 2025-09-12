import React from "react";

import WalletItem from "./WalletItem";
import Offer from "./Offer";

interface WalletItemDataProps {
    walletName?: string;
    walletIcon?: string;
    fiatBalance?: number;
    cryptoBalance?: number;
}

interface WalletsProps {
    wallets: WalletItemDataProps[];
}

const Wallets = ({ wallets }: WalletsProps) => {
    return (
        <div className="p-[1.6rem] mt-[-2rem] bg-white rounded-t-[2rem] w-full h-full">
            <Offer />
            <div className="flex flex-col gap-[1rem]">
                {wallets?.map((item, index) => (
                    <WalletItem key={index} {...item} />
                ))}
            </div>
        </div>
    );
};

export default Wallets;
