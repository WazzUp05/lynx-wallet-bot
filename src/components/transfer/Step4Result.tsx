"use client";
import { useAppSelector } from "@/lib/redux/hooks";
import Succsessfully from "@/components/transfer/step4/Successfully";
import Rejected from "@/components/transfer/step4/Reject";
import Details from "@/components/transfer/step4/Details";
import {
    getTransactionId,
    getTransferAmount,
    getTransferCrypto,
} from "@/lib/redux/selectors/transferSelectors";
import { getTransferIsSuccessful } from "@/lib/redux/selectors/transferSelectors";
import Loader from "@/components/ui/Loader";
import { useMixpanel } from "@/lib/providers/MixpanelProvider";
import { useEffect, useState } from "react";

interface Step4ResultProps {
    setStep: (step: number) => void;
    commissionUsdt: number;
}

const Step4Result: React.FC<Step4ResultProps> = ({ setStep, commissionUsdt }) => {
    const transactionId = useAppSelector(getTransactionId);
    const amount = useAppSelector(getTransferAmount);
    const crypto = useAppSelector(getTransferCrypto);
    const isSuccessful = useAppSelector(getTransferIsSuccessful);
    const { trackEvent } = useMixpanel();
    const [isOpenedDetails, setIsOpenedDetails] = useState(false);

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

    useEffect(() => {
        trackEvent("transfer_step4_result_opened", {
            isSuccessful,
            date,
            transactionId,
            amount,
            crypto,
        });
    }, [trackEvent, isSuccessful, date, transactionId, amount, crypto]);

    return (
        <>
            {isSuccessful === null && <Loader className="h-[100dvh]" />}
            {isSuccessful === true && !isOpenedDetails && (
                <Succsessfully
                    amount={amount}
                    crypto={crypto}
                    transactionId={transactionId}
                    setIsOpenedDetails={setIsOpenedDetails}
                />
            )}
            {isSuccessful === false && !isOpenedDetails && (
                <Rejected
                    amount={amount}
                    setStep={setStep}
                    crypto={crypto}
                    setIsOpenedDetails={setIsOpenedDetails}
                />
            )}
            {isOpenedDetails && isSuccessful !== null && (
                <Details
                    isOpen={isOpenedDetails}
                    setIsOpenedDetails={setIsOpenedDetails}
                    amount={amount}
                    crypto={crypto}
                    isSuccessful={isSuccessful}
                    date={date}
                    transactionId={transactionId}
                    commissionUsdt={commissionUsdt}
                />
            )}
        </>
    );
};

export default Step4Result;
