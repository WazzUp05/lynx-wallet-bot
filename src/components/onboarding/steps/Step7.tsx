'use client';

import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { getHistory } from '@/lib/redux/selectors/historySelectors';
import { fetchHistory } from '@/lib/redux/thunks/historyThunks';
import { setWaitingForDeposit, setOnboardingCompleted, setIsFirstTime } from '@/lib/redux/slices/appSlice';
import { Button } from '@/components/ui/Button';

import ClockIcon from '@/components/icons/clock-bg.svg';
import WarrningIcon from '@/components/icons/warrning-mark.svg';
import QuestionIcon from '@/components/icons/question.svg';
import Link from 'next/link';
import { Toast } from '@/components/ui/Toast';
interface Step7Props {
    onNext: () => void;
    onGoToStep5?: () => void;
}

const Step7: React.FC<Step7Props> = ({ onNext, onGoToStep5 }) => {
    const [toastOpen, setToastOpen] = useState(true);

    const handleCheckAgain = () => {
        if (onGoToStep5) {
            onGoToStep5();
        } else {
            onNext();
        }
    };

    return (
        <div className="flex flex-1 flex-col p-[1.6rem] pt-[6rem] pb-[calc(var(--safe-bottom)+1.6rem)] bg-[var(--bg-optional)] ">
            <Toast open={toastOpen} message="Отклонено" onClose={() => setToastOpen(false)} type="warrning" />
            <div
                className={`w-[60rem] h-[60rem] absolute top-[7.4rem] left-[-43.4rem] ${'bg-[#FFFFFF0D]'} blur-[12rem] rounded-[50%] `}
            />
            <div
                className={`w-[60rem] h-[50rem] absolute top-[7.4rem] right-[-43.4rem] ${'bg-[#FFFFFF0D]'} blur-[12rem] rounded-[50%] `}
            />
            <div className="w-full flex-1 relative flex flex-col items-center">
                <div className="w-[8rem] h-[8rem] rounded-full bg-[var(--yellow-secondary)] center mb-[1.6rem]">
                    <QuestionIcon className="text-[var(--yellow)]" width={40} height={40} />
                </div>

                <h2 className="text-[2.2rem] text-[var(--text-main)] font-bold leading-[130%] mb-[0.8rem]">
                    Перевод не прошёл
                </h2>

                <p className="text-[1.5rem] text-[var(--text-main)] mb-[1.6rem]">Что могло произойти:</p>
                <div className="bg-[var(--bg-optional)] rounded-[2rem] p-[1.6rem] flex flex-col gap-[1.6rem] mb-[4.4rem]">
                    <div className="flex items-start gap-[0.6rem]">
                        <div className="min-w-[1.6rem] flex-1 flex min-h-[1.6rem] text-[1.2rem] leading-[130%] font-semibold flex-shrink-0 rounded-full bg-[var(--text-main)] text-[var(--bg-secondary)] center">
                            1
                        </div>
                        <p className="text-[1.2rem] leading-[130%] text-[var(--text-main)]">
                            Минимальная сумма перевода — 5 USDT. Попробуйте отправить чуть больше.
                        </p>
                    </div>
                    <div className="flex items-start gap-[0.6rem]">
                        <div className="min-w-[1.6rem] flex-1 flex min-h-[1.6rem] text-[1.2rem] leading-[130%] font-semibold flex-shrink-0 rounded-full bg-[var(--text-main)] text-[var(--bg-secondary)] center">
                            2
                        </div>
                        <p className="text-[1.2rem] leading-[130%] text-[var(--text-main)]">
                            Кошелёк принимает только USDT в сети TRC20. Переводы из других сетей не зачисляются.
                        </p>
                    </div>
                    <div className="flex items-start gap-[0.6rem]">
                        <div className="min-w-[1.6rem] flex-1 flex min-h-[1.6rem] text-[1.2rem] leading-[130%] font-semibold flex-shrink-0 rounded-full bg-[var(--text-main)] text-[var(--bg-secondary)] center">
                            3
                        </div>
                        <p className="text-[1.2rem] leading-[130%] text-[var(--text-main)]">
                            Перевод не был подтверждён вовремя. Попробуйте повторить операцию.
                        </p>
                    </div>
                    <div className="flex items-start gap-[0.6rem]">
                        <div className="min-w-[1.6rem] flex-1 flex min-h-[1.6rem] text-[1.2rem] leading-[130%] font-semibold flex-shrink-0 rounded-full bg-[var(--text-main)] text-[var(--bg-secondary)] center">
                            4
                        </div>
                        <p className="text-[1.2rem] leading-[130%] text-[var(--text-main)]">
                            Мы не получили подтверждение транзакции. Проверьте в своём кошельке, была ли она завершена.
                        </p>
                    </div>
                    <div className="flex items-start gap-[0.6rem]">
                        <div className="min-w-[1.6rem] flex-1 flex min-h-[1.6rem] text-[1.2rem] leading-[130%] font-semibold flex-shrink-0 rounded-full bg-[var(--text-main)] text-[var(--bg-secondary)] center">
                            5
                        </div>
                        <p className="text-[1.2rem] leading-[130%] text-[var(--text-main)]">
                            Если вы не нашли подходящий вариант, то&nbsp;
                            <Link
                                href="https://t.me/Lynxwalletsupport_bot"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--yellow)] underline underline-offset-[0.2rem]"
                            >
                                обратитесь в поддержку.
                            </Link>
                        </p>
                    </div>
                </div>

                <Button variant="yellow" className="w-full mt-auto" onClick={handleCheckAgain}>
                    Проверить снова
                </Button>
            </div>
        </div>
    );
};

export default Step7;
