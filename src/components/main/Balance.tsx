import React, { useState } from "react";
import EyeIcon from "@/components/icons/eye.svg";
import EyeHiddenIcon from "@/components/icons/eye-hidden.svg";
import { useAppSelector } from "@/lib/redux/hooks";
import { getRatesQuoteRub } from "@/lib/redux/selectors/rateSelectors";

interface BalanceProps {
    balance: number;
}

const Balance = ({ balance }: BalanceProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const rate = useAppSelector(getRatesQuoteRub);
    const convertedBalance = balance && rate ? (balance * rate).toFixed(2) : 0;

    return (
        <div className="text-center mb-[3rem]">
            <p className="flex fs-small text-white mb-[1rem] justify-center items-center gap-[0.5rem]">
                Общий баланс{" "}
                <button onClick={() => setIsVisible(!isVisible)}>{isVisible ? <EyeIcon /> : <EyeHiddenIcon />}</button>
            </p>
            <p className="fs-vbig text-white justify-center flex items-center">
                {balance ? (isVisible ? `${convertedBalance} ₽` : "********") : 0}{" "}
            </p>
        </div>
    );
};

export default Balance;
