import React from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { getRatesQuoteRub } from '@/lib/redux/selectors/rateSelectors';
import { getHideBalance } from '@/lib/redux/selectors/appSelectors';

interface BalanceProps {
    balance: number;
    isVisible?: boolean;
}

const Balance = ({ balance, isVisible = true }: BalanceProps) => {
    const rate = useAppSelector(getRatesQuoteRub);
    const hideBalance = useAppSelector(getHideBalance);

    const rubBalance = balance && rate ? (balance * rate).toFixed(2) : '0.00';

    return (
        <div className="text-center mb-[3rem] rounded-[1.5rem] p-[1.5rem] relative">
            <div className="relative flex flex-col  justify-center items-center">
                <span
                    className={`mb-[0.5rem] center w-full text-[3.5rem] font-semibold leading-[130%] transition-all duration-400 text-[var(--text-main)]`}
                >
                    {!hideBalance ? rubBalance + ' ₽' : '********'}
                </span>
                <p className=" text-[1.4rem] leading-[130%] text-[var(--text-secondary)] justify-center items-center gap-[0.5rem]">
                    Баланс
                </p>
            </div>
        </div>
    );
};

export default Balance;
