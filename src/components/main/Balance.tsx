import React, { useState } from "react";
import EyeIcon from "@/components/icons/eye.svg";
import EyeHiddenIcon from "@/components/icons/eye-hidden.svg";
import { useAppSelector } from "@/lib/redux/hooks";
import { getRatesQuoteRub } from "@/lib/redux/selectors/rateSelectors";
import RubIcon from "@/components/icons/ruble.svg";
import UsdtIcon from "@/components/icons/usdt.svg";

interface BalanceProps {
    balance: number;
}

const Balance = ({ balance }: BalanceProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const [currency, setCurrency] = useState<"RUB" | "USDT">("RUB");
    const rate = useAppSelector(getRatesQuoteRub);

    const rubBalance = balance && rate ? (balance * rate).toFixed(2) : "0.00";
    const usdt = balance ? balance.toFixed(2) : "0.00";

    return (
        <div className="text-center mb-[3rem] rounded-[1.5rem] p-[1.5rem]">
            <p className="flex fs-small text-white mb-[1rem] justify-center items-center gap-[0.5rem]">
                Общий баланс{" "}
                <button onClick={() => setIsVisible(!isVisible)}>{isVisible ? <EyeIcon /> : <EyeHiddenIcon />}</button>
            </p>
            <div className="relative h-[3.8rem] mb-[1rem] overflow-hidden flex justify-center items-center">
                {/* RUB баланс */}
                <span
                    className={`absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center w-full fs-vbig transition-all duration-400
                        ${currency === "RUB" ? "opacity-100 translate-x-0 z-10" : "opacity-0 -translate-x-10 z-0"}
                        text-white`}
                >
                    {isVisible ? rubBalance : "********"}
                </span>
                {/* USDT баланс */}
                <span
                    className={`absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center w-full fs-vbig transition-all duration-400
                        ${currency === "USDT" ? "opacity-100 translate-x-0 z-10" : "opacity-0 translate-x-10 z-0"}
                        text-white`}
                >
                    {isVisible ? usdt : "********"}
                </span>
            </div>
            {isVisible && (
                <div className="flex justify-center bg-white w-max mx-auto rounded-full p-[0.3rem]">
                    <button
                        className={`flex items-center px-[1.4rem] py-[0.45rem] gap-[0.3rem] leading-[130%] rounded-full  text-[1.4rem]  ${
                            currency === "RUB" ? "bg-[#FFDC2D] text-black" : "bg-white text-gray-400"
                        }`}
                        onClick={() => setCurrency("RUB")}
                    >
                        <RubIcon
                            width={15}
                            height={15}
                            className={currency === "RUB" ? "filter " : "filter grayscale"}
                        />{" "}
                        <span>RUB</span>
                    </button>
                    <button
                        className={`flex items-center gap-[0.3rem] px-[1.4rem] leading-[130%]  py-[0.45rem] rounded-full  text-[1.4rem] ${
                            currency === "USDT" ? "bg-[#FFDC2D] text-black" : "bg-white text-gray-400"
                        }`}
                        onClick={() => setCurrency("USDT")}
                    >
                        <UsdtIcon
                            width={15}
                            height={15}
                            className={currency === "USDT" ? "filter " : "filter grayscale"}
                        />{" "}
                        <span>USDT</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Balance;
