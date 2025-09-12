import React from "react";
import PlusIcon from "@/components/icons/plus.svg";
import SendIcon from "@/components/icons/send.svg";
import BankIcon from "@/components/icons/bank.svg";
import BagIcon from "@/components/icons/bag.svg";

interface NavigationProps {
    onTopUp?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onTopUp }) => {
    return (
        <div className="flex gap-[2rem] items-center justify-center mb-[1rem]">
            <button className="fs-small text-white" onClick={onTopUp}>
                <div className="bg-white text-black w-[6rem] h-[6rem] rounded-full flex items-center justify-center mb-[0.5rem]">
                    <PlusIcon />
                </div>
                <span className="text-[1.1rem] leading-[130%]">Пополнить</span>
            </button>
            <button className="fs-small text-white">
                <div className="bg-white text-black w-[6rem] h-[6rem] rounded-full flex items-center justify-center mb-[0.5rem]">
                    <SendIcon />
                </div>
                <span className="text-[1.1rem] leading-[130%]">Отправить</span>
            </button>
            <button className="fs-small text-white">
                <div className="bg-white text-black w-[6rem] h-[6rem] rounded-full flex items-center justify-center  mb-[0.5rem]">
                    <BankIcon />
                </div>
                <span className="text-[1.1rem] leading-[130%]">Банк</span>
            </button>
            <button className="fs-small text-white">
                <div className="bg-white text-black w-[6rem] h-[6rem] rounded-full flex items-center justify-center mb-[0.5rem]">
                    <BagIcon />
                </div>
                <span className="text-[1.1rem] leading-[130%]">Оплатить</span>
            </button>
        </div>
    );
};

export default Navigation;
