import React from "react";
import PlusIcon from "@/components/icons/plus.svg";
import SendIcon from "@/components/icons/send.svg";
import BankIcon from "@/components/icons/bank.svg";
import BagIcon from "@/components/icons/bag.svg";
import Link from "next/link";

interface NavigationProps {
    onTopUp?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onTopUp }) => {
    return (
        <div className="flex gap-[2rem] items-center justify-center mb-[1rem]">
            <button className="fs-small text-white" onClick={onTopUp}>
                <div className="bg-white text-black w-[6rem] h-[6rem] rounded-full flex items-center justify-center mb-[0.5rem]">
                    <PlusIcon width={30} height={30} className="w-[3rem] h-[3rem]" />
                </div>
                <span className="text-[1.1rem] leading-[130%]">Пополнить</span>
            </button>
            <button className="fs-small text-white pointer-events-none  relative">
                <span className="absolute left-1/2 top-0 translate-x-[-50%] rounded-[1.5rem] translate-y-[-50%] text-[1.2rem] font-medium leading-[130%] bg-white py-[0.2rem] text-black px-[0.7rem] ">
                    Скоро
                </span>
                <div className="bg-[#D9D9DD] text-[#9C9DA4] w-[6rem] h-[6rem] rounded-full flex items-center justify-center mb-[0.5rem]">
                    <SendIcon width={30} height={30} className="w-[3rem] h-[3rem]" />
                </div>
                <span className="text-[1.1rem] leading-[130%]">Отправить</span>
            </button>
            <button className="fs-small text-white relative">
                <span className="absolute left-1/2 top-0 translate-x-[-50%] rounded-[1.5rem] translate-y-[-50%] text-[1.2rem] font-medium leading-[130%] bg-white py-[0.2rem] text-black px-[0.7rem] ">
                    Скоро
                </span>
                <div className="bg-[#D9D9DD] text-[#9C9DA4] w-[6rem] h-[6rem] rounded-full flex items-center justify-center  mb-[0.5rem]">
                    <BankIcon width={30} height={30} className="w-[3rem] h-[3rem]" />
                </div>
                <span className="text-[1.1rem] leading-[130%]">Продать</span>
            </button>
            <Link href="/qr" className="fs-small text-white text-center">
                <div className="bg-white text-black w-[6rem] h-[6rem] rounded-full flex items-center justify-center mb-[0.5rem]">
                    <BagIcon width={30} height={30} className="w-[3rem] h-[3rem]" />
                </div>
                <span className="text-[1.1rem] leading-[130%]">Оплатить</span>
            </Link>
        </div>
    );
};

export default Navigation;
