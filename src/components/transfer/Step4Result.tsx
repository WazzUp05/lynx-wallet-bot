"use client";
import { useAppSelector } from "@/lib/redux/hooks";
import Succsessfully from "@/components/transfer/step4/Successfully";
import Rejected from "@/components/transfer/step4/Reject";
import {
    getTransactionId,
    getTransferAmount,
    getTransferCrypto,
} from "@/lib/redux/selectors/transferSelectors";
import { getTransferIsSuccessful } from "@/lib/redux/selectors/transferSelectors";
import Loader from "@/components/ui/Loader";


interface Step4ResultProps {
    setStep: (step: number) => void;
}

const Step4Result: React.FC<Step4ResultProps> = ({ setStep }) => {
    const transactionId = useAppSelector(getTransactionId);
    const amount = useAppSelector(getTransferAmount);
    const crypto = useAppSelector(getTransferCrypto);
    const isSuccessful = useAppSelector(getTransferIsSuccessful);

    const now = new Date();
    const date = now
        .toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })
        .replace(",", "");

    return (
        <>
            {isSuccessful === null && <Loader className="h-[100dvh]" />}
            {isSuccessful && (
                <Succsessfully
                    amount={amount}
                    crypto={crypto}
                    transactionId={transactionId}
                    date={date}
                />
            )}
            {!isSuccessful && (
                <Rejected
                    amount={amount}
                    setStep={setStep}
                    crypto={crypto}
                    date={date}
                    transactionId={transactionId}
                />
            )}
        </>
    );
};

export default Step4Result;
