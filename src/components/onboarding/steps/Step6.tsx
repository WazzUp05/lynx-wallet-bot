"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { getHistory } from "@/lib/redux/selectors/historySelectors";
import { fetchHistory } from "@/lib/redux/thunks/historyThunks";
import {
    setWaitingForDeposit,
    setOnboardingCompleted,
    setIsFirstTime,
} from "@/lib/redux/slices/appSlice";
import { Button } from "@/components/ui/Button";

import WarrningBlock from "@/components/WarrningBlock";
import Image from "next/image";
import Loader from "@/components/ui/Loader";
import { HistoryItemType } from "@/components/history/HistoryDay";
import { Toast } from "@/components/ui/Toast";
import { useMixpanel } from "@/lib/providers/MixpanelProvider";
interface Step6Props {
    onNext: () => void;
}

const Step6: React.FC<Step6Props> = ({ onNext }) => {
    const dispatch = useAppDispatch();
    const history = useAppSelector(getHistory);
    const [isSuccess, setIsSuccess] = useState(false);
    const [lastTransaction, setLastTransaction] = useState<HistoryItemType | null>(null);
    const [toastOpen, setToastOpen] = useState(true);
    const { trackEvent } = useMixpanel();

    useEffect(() => {
        if (isSuccess) {
            setToastOpen(true);
        }
    }, [isSuccess]);

    // Проверяем историю каждые 2 минуты
    useEffect(() => {
        const checkHistory = async () => {
            try {
                await dispatch(fetchHistory()).unwrap();
            } catch (error) {
                console.error("Ошибка при проверке истории:", error);
            }
        };

        // Проверяем сразу при загрузке
        checkHistory();

        // Устанавливаем интервал на 2 минуты (120000 мс)
        const interval = setInterval(checkHistory, 120000);

        return () => {
            clearInterval(interval);
        };
    }, [dispatch]);

    // Проверяем, есть ли новые транзакции
    useEffect(() => {
        if (history && history.length > 0) {
            const latestTransaction = history[0]; // Предполагаем, что транзакции отсортированы по дате
            if (latestTransaction && latestTransaction.status === "completed") {
                setIsSuccess(true);
                setLastTransaction(latestTransaction);
                // Устанавливаем состояние успешного пополнения
                dispatch(setWaitingForDeposit(true));
            }
        }
    }, [history, dispatch]);

    React.useEffect(() => {
        if (isSuccess && lastTransaction) {
            trackEvent("wallet_deposit_success", { amount: lastTransaction.amount });
        }
    }, [isSuccess, lastTransaction]);

    const handleGoToWallet = () => {
        // Завершаем онбординг и переходим к кошельку
        dispatch(setOnboardingCompleted(true));
        dispatch(setIsFirstTime(false));
        dispatch(setWaitingForDeposit(false));
        onNext();
    };

    return (
        <div className="flex flex-1 flex-col p-[1.6rem] pt-[6rem] pb-[calc(var(--safe-bottom)+1.6rem)] bg-[var(--bg-optional)] ">
            {isSuccess ? (
                <Toast
                    open={toastOpen}
                    message="Успешно"
                    onClose={() => {
                        setToastOpen(false);
                    }}
                    type="success"
                />
            ) : (
                <Toast
                    open={toastOpen}
                    message="Ожидание"
                    onClose={() => {
                        setToastOpen(false);
                    }}
                    type="waiting"
                />
            )}

            <div
                className={`w-[60rem] h-[60rem] absolute top-[7.4rem] left-[-43.4rem] ${
                    isSuccess ? "bg-[#34C85A4D]" : "bg-[#007AFF4D]"
                } blur-[12rem] rounded-[50%] `}
            />
            <div
                className={`w-[60rem] h-[50rem] absolute top-[7.4rem] right-[-43.4rem] ${
                    isSuccess ? "bg-[#34C85A4D]" : "bg-[#007AFF4D]"
                } blur-[12rem] rounded-[50%] `}
            />
            <div className="w-full flex-1 relative flex flex-col items-center">
                <div className="w-[8rem] h-[8rem] rounded-full bg-[#EBECEF1A] center mb-[1.6rem]">
                    {isSuccess ? (
                        <Image src="/tick-circle-big.svg" alt="Paid" width={40} height={40} />
                    ) : (
                        <Loader className="w-[2.8rem] h-[2.8rem] " />
                    )}
                </div>

                {isSuccess ? (
                    <>
                        <h2 className="text-[2.2rem] text-[var(--text-main)] font-bold leading-[130%] mb-[0.8rem]">
                            {lastTransaction?.amount?.toFixed(2)} USDT
                        </h2>
                        {lastTransaction && (
                            <p className="text-[1.5rem] text-[var(--text-main)]">
                                Отлично! Теперь вы можете совершить свою первую покупку.
                            </p>
                        )}
                        <Button
                            variant="yellow"
                            className="w-full mt-auto"
                            onClick={handleGoToWallet}
                        >
                            Перейти в кошелёк
                        </Button>
                    </>
                ) : (
                    <>
                        <h2 className="text-[2.2rem] text-[var(--text-main)] font-bold leading-[130%] mb-[1.6rem]">
                            Проверяем перевод
                        </h2>
                        <WarrningBlock
                            className="items-center"
                            classNameIcon="text-[var(--yellow)]"
                            text="Обычно это занимает до 30 минут."
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Step6;
