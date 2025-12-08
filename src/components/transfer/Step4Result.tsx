"use client";
import { useAppSelector } from "@/lib/redux/hooks";
import Succsessfully from "@/components/transfer/step4/Successfully";
import Rejected from "@/components/transfer/step4/Reject";
import { getTransferAmount, getTransferCrypto } from "@/lib/redux/selectors/transferSelectors";
import { v1 as uuidv1 } from "uuid";

interface Step4ResultProps {
    setStep: (step: number) => void;
}

const Step4Result: React.FC<Step4ResultProps> = ({ setStep }) => {
    const transactionId = `LYNXW-${uuidv1()}`;
    const amount = useAppSelector(getTransferAmount);
    const crypto = useAppSelector(getTransferCrypto);

    return (
        // <Succsessfully amount={amount} crypto={crypto} transactionId={transactionId} />
        <Rejected amount={amount} setStep={setStep} crypto={crypto} />
    );
};

export default Step4Result;
