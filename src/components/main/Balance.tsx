import React from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { getRatesQuoteRub } from '@/lib/redux/selectors/rateSelectors';
import {
    getHideBalance,
    getShouldDisableButtons,
    getWaitingForDeposit,
} from '@/lib/redux/selectors/appSelectors';
import WarrningIcon from '@/components/icons/warrning-mark.svg';
import ClockIcon from '@/components/icons/clock-bg.svg';

interface BalanceProps {
    balance: number;
}

const Balance = ({ balance }: BalanceProps) => {
    const rate = useAppSelector(getRatesQuoteRub);
    const hideBalance = useAppSelector(getHideBalance);
    const shouldDisableButtons = useAppSelector(getShouldDisableButtons);
    const waitingDeposit = useAppSelector(getWaitingForDeposit);

    const rubBalance = balance && rate ? (balance * rate).toFixed(2) : '0.00';

    return (
        <div
            className={`text-center ${
                waitingDeposit && !shouldDisableButtons ? 'mb-[3.1rem]' : 'mb-[0.8rem]'
            } rounded-[1.5rem]  relative`}
        >
            <div className="relative flex flex-col  justify-center items-center">
                <span
                    className={`mb-[0.5rem] center w-full text-[3.5rem] font-semibold leading-[130%] transition-all duration-400 text-[var(${
                        shouldDisableButtons ? '--text-optional' : '--text-main'
                    })]`}
                >
                    {!hideBalance ? rubBalance + ' ₽' : '********'}
                </span>
                <p
                    className={` text-[1.4rem] leading-[130%] text-[var(${
                        shouldDisableButtons ? '--text-optional' : '--text-main'
                    })] justify-center items-center gap-[0.5rem]`}
                >
                    Баланс
                </p>
            </div>

            {waitingDeposit && (
                <>
                    <div
                        className={` box-shadow rounded-[1.5rem] flex items-center gap-[0.5rem] py-[0.55rem] px-[0.7rem] text-[1.2rem] leading-[130%] font-semibold bg-[var(--dark-gray-main)] text-[var(--text-main)] mb-[1.2rem] mt-[0.8rem] w-fit mx-auto
                    `}
                    >
                        <div className="center w-[2.4rem] h-[2.4rem]">
                            <ClockIcon className="text-[var(--yellow)]" width={19} height={19} />
                        </div>
                        Ожидание зачисления
                    </div>
                    <div className="flex flex-col gap-[1.2rem] bg-[var(--yellow-optional)] rounded-[1.5rem] p-[1.6rem]">
                        <div
                            className={`w-full flex gap-[0.5rem] items-center  text-[1.2rem] leading-[130%]`}
                        >
                            <div className="text-[var(--text-main)]">
                                <WarrningIcon width={16} height={16} />
                            </div>
                            <span className="text-[var(--text-main)]">
                                Может занимать до 30 минут.
                            </span>
                        </div>
                        <div className={`w-full flex gap-[0.5rem] text-[1.2rem] leading-[130%]`}>
                            <div className="text-[var(--text-main)]">
                                <WarrningIcon width={16} height={16} />
                            </div>
                            <span className="text-[var(--text-main)] text-left">
                                Если деньги не появились, обновите страницу при помощи кнопки в
                                верхнем правом углу.
                            </span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Balance;
