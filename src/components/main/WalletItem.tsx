import Image from "next/image";
import React from "react";

interface WalletItemProps {
    walletName?: string;
    walletIcon?: string;
    fiatBalance?: number;
    cryptoBalance?: number;
    soon?: boolean;
}

const WalletItem: React.FC<WalletItemProps> = ({ walletName, walletIcon, fiatBalance, cryptoBalance, soon }) => {
    return (
        <div
            className={`py-[1rem] w-full px-[1.6rem] ${soon && "pointer-events-none"} ${!soon && "box-shadow"} ${
                soon ? "bg-[#F2F3F4]" : "bg-white"
            }  rounded-[1.5rem] flex items-center justify-between`}
        >
            <div className="flex items-center gap-[1rem]">
                <Image src={walletIcon || "/wallet-icon.png"} alt="Wallet Icon" width={40} height={40} />
                <div className="flex flex-col ">
                    <p className="text-[1.5rem] leading-[130%] text-black font-bold">{walletName || "Wallet Name"}</p>
                    <p className="text-[1.5rem] leading-[130%] text-[var(--gray)]">{fiatBalance || "0.00"} ₽</p>
                </div>
            </div>
            <div className="flex flex-col">
                {soon ? (
                    <div className="bg-[#D9D9DD] text-white text-[1.4rem] leading-[130%] px-[1rem] py-[0.4rem] rounded-[1.5rem] text-center">
                        Скоро
                    </div>
                ) : (
                    <>
                        <p className="text-[1.5rem] leading-[130%] text-black font-bold text-right">
                            {cryptoBalance || "0.00"} ₽
                        </p>
                        <p className="text-[1.5rem] leading-[130%] text-[var(--gray)] text-right">
                            {cryptoBalance || "0.00"} USDT
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default WalletItem;
