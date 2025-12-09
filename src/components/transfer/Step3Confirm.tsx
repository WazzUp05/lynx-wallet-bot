"use client";
import Image from "next/image";
import { v1 as uuidv1 } from "uuid";

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
    getTransferAmount,
    getTransferAdress,
    getTransferCrypto,
    getTransferNetwork,
    getTransferIsLoading,
} from "@/lib/redux/selectors/transferSelectors";
import {
    setTransferIsLoading,
    setTransactionId,
    setTransferError,
    setTransferIsSuccessful,
} from "@/lib/redux/slices/transferSlice";
import { Button } from "../ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import { updateBalance } from "@/lib/redux/slices/userSlice";

type Step3ConfirmProps = {
    selectedNetwork: string;
    selectedCrypto: string;
    handleNextStep: () => void;
    cryptos: {
        id: string;
        label: string;
        description: string;
        iconUrl: string;
    }[];
};

const Step3Confirm: React.FC<Step3ConfirmProps> = ({ selectedCrypto, cryptos, handleNextStep }) => {
    const dispatch = useAppDispatch();
    const selected = cryptos.find((crypto) => crypto.id === selectedCrypto);
    const amount = useAppSelector(getTransferAmount);
    const crypto = useAppSelector(getTransferCrypto);
    const network = useAppSelector(getTransferNetwork);
    const address = useAppSelector(getTransferAdress);
    const isLoading = useAppSelector(getTransferIsLoading);
    const COMMISSION_USDT = 2.75;
    const addressSliced = `${address.slice(0, 7)}...${address.slice(-8)}`;

    const handleConfirmTransfer = async () => {
        dispatch(setTransferError(null));
        dispatch(setTransferIsLoading(true));
        if (isLoading) return;

        try {
            const response = await fetch("/api/transfer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount,
                    crypto,
                    network,
                    address,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                throw new Error(data.error || "Transfer failed");
            }

            dispatch(setTransactionId(data.transactionId) || uuidv1());
            dispatch(setTransferIsSuccessful(Boolean(data.success)));

            // обновляем баланс пользователя до автообновления
            const totalDeducted = Number(amount) + COMMISSION_USDT;
            dispatch(updateBalance(-totalDeducted));

            handleNextStep();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            console.error("Transfer error:", errorMessage);

            dispatch(setTransferError(errorMessage));
            dispatch(setTransferIsSuccessful(false));
        } finally {
            dispatch(setTransferIsLoading(false));
        }
    };

    return (
        <div className="flex flex-col gap-[2rem] max-h-[100dvh] mx-[1.6rem] pb-[1rem]">
            <div className="flex flex-col gap-[1rem] items-center py-[1rem] w-full">
                <Image
                    src={selected?.iconUrl || ""}
                    alt={selected?.label || ""}
                    width={40}
                    height={40}
                    className="w-[6rem] h-[6rem] rounded-full self-center"
                />
                <p className="fs-regular-bold text-[var(--text-main)] self-center">
                    {amount} {crypto}
                </p>
            </div>
            <div className="flex flex-col gap-[1.6rem]">
                <div className="flex flex-col bg-[var(--bg-secondary)] rounded-[1rem] p-[1.6rem] gap-[1.6rem]">
                    <div className="flex justify-between items-center">
                        <p className="text-[var(--text-secondary)] fs-small">Будет отправлено</p>
                        <p className="fs-regular text-[var(--text-main)]">
                            {amount} {crypto}
                        </p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-[var(--text-secondary)] fs-small">Комиссия</p>
                        <p className="fs-regular text-[var(--text-main)]">
                            {crypto === "USDT" ? "2.75 USDT" : "0.2 TON"}
                        </p>
                    </div>
                </div>
                <div className=" bg-[var(--bg-secondary)] rounded-[1rem] p-[1.6rem] flex justify-between items-center">
                    <p className="text-[var(--text-secondary)] fs-small">Сеть</p>
                    <p className="fs-regular text-[var(--text-main)]">{network}</p>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-[1rem] p-[1.6rem] flex justify-between items-center">
                    <p className="text-[var(--text-secondary)] fs-small">Получатель</p>
                    <div className="flex gap-[0.8rem]">
                        <p className="fs-regular text-[var(--text-main)]">{addressSliced}</p>
                        <CopyButton text={address} />
                    </div>
                </div>
            </div>
            <div>
                <p className="text-[var(--text-secondary)] fs-very-small">
                    Убедитесь, что адрес получателя принадлежит сети TRC20, иначе ваши средства
                    могут быть безвозвратно утеряны.
                </p>
            </div>
            <Button
                variant="yellow"
                fullWidth={true}
                onClick={handleConfirmTransfer}
                disabled={isLoading}
            >
                {isLoading ? "Отправка..." : "Подтвердить перевод"}
            </Button>
        </div>
    );
};

export default Step3Confirm;
