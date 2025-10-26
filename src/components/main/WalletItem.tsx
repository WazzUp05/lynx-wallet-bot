import Image from 'next/image';
import React from 'react';
import RateUpIcon from '@/components/icons/rate-up.svg';
import RateDownIcon from '@/components/icons/rate-down.svg';
import { getHideBalance } from '@/lib/redux/selectors/appSelectors';
import { useAppSelector } from '@/lib/redux/hooks';

interface WalletItemProps {
    walletName?: string;
    walletIcon?: string;
    fiatBalance?: number;
    cryptoBalance?: number;
    soon?: boolean;
    rate?: number | null;
    rateChange?: number | null;
}

const WalletItem: React.FC<WalletItemProps> = ({
    walletName,
    walletIcon,
    fiatBalance,
    cryptoBalance,
    soon,
    rate,
    rateChange,
}) => {
    const hideBalance = useAppSelector(getHideBalance);
    const isPositiveChange = rateChange !== null && rateChange !== undefined && rateChange > 0;
    const isNegativeChange = rateChange !== null && rateChange !== undefined && rateChange < 0;
    const hasChange = rateChange !== null && rateChange !== undefined && rateChange !== 0;

    return (
        <div
            className={`p-[1.6rem] min-w-[23rem]  ${soon && 'pointer-events-none'} bg-[var(--bg-main)]
              rounded-[2rem] flex flex-col gap-[1.6rem] items-center justify-center first:ml-[1.6rem] last:mr-[1.6rem]`}
        >
            <div className="flex w-full gap-[1rem]">
                <Image
                    src={walletIcon || '/wallet-icon.png'}
                    alt="Wallet Icon"
                    className={` w-[4rem] h-[4rem]`}
                    width={40}
                    height={40}
                />
                <div className="flex flex-col w-full">
                    <p
                        className={`text-[1.8rem] leading-[130%] ${
                            soon ? 'text-[var(--text-optional)]' : 'text-[var(--text-main)]'
                        } font-bold `}
                    >
                        {!hideBalance ? (fiatBalance ? fiatBalance + ' ₽' : '0 ₽') : '********'}
                    </p>
                    <p
                        className={`text-[1.4rem] leading-[130%] ${
                            soon ? 'text-[var(--text-optional)]' : 'text-[var(--text-secondary)]'
                        } `}
                    >
                        {!hideBalance
                            ? cryptoBalance
                                ? cryptoBalance + ' ' + walletName
                                : '0 ' + walletName
                            : '********'}
                    </p>
                </div>
            </div>
            <div className="flex flex-col w-full min-h-[6.4rem] bg-[var(--bg-secondary)] rounded-[2rem] px-[1.6rem] py-[1.2rem]">
                {soon ? (
                    <div className=" text-[1.5rem] text-[var(--text-optional)] leading-[130%] text-center m-auto">
                        Скоро
                    </div>
                ) : (
                    <>
                        <p className="text-[1.5rem] leading-[130%] text-[var(--text-secondary)] font-semibold mb-[0.3rem]">
                            {walletName || 'Wallet Name'}
                        </p>

                        <div className="flex items-center gap-[1rem]">
                            <p className="text-[1.4rem] leading-[130%]  text-[var(--text-main)]">
                                {rate ? Number(rate).toFixed(2) : '0.00'} ₽
                            </p>
                            {hasChange && isPositiveChange && (
                                <span className="flex text-[1.4rem] leading-[130%] items-center gap-[0.3rem] text-[var(--green-main)]">
                                    <RateUpIcon /> {Math.abs(rateChange).toFixed(2)}%
                                </span>
                            )}
                            {hasChange && isNegativeChange && (
                                <span className="flex text-[1.4rem] leading-[130%] items-center gap-[0.3rem] text-[var(--red-main)]">
                                    <RateDownIcon /> {Math.abs(rateChange).toFixed(2)}%
                                </span>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WalletItem;
