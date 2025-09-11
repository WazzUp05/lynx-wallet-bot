import React from "react";
import Modal from "../Modal";
import WalletIcon from "@/components/icons/empty-wallet.svg";
import CardIcon from "@/components/icons/card.svg";
import ShareIcon from "@/components/icons/share.svg";
import Profile2Icon from "@/components/icons/profile-2user.svg";
import RightArrowIcon from "@/components/icons/right-arrow.svg";
import Link from "next/link";

const MOCK_WAYS = [
    {
        icon: <WalletIcon />,
        href: "/refilled",
        name: "Внешний кошелёк",
        text: "Перевод с другого кошелька",
        active: true,
    },
    {
        icon: <CardIcon />,
        name: "Банковская карта",
        text: "Покупка криптовалюты по карте",
        active: false,
    },
    {
        icon: <ShareIcon />,
        name: "Экспресс-покупка",
        text: "Покупка у продавца в 3 шага",
        active: false,
    },
    {
        icon: <Profile2Icon />,
        name: "P2P рынок",
        text: "Купить без посредников",
        active: false,
    },
];

interface RefilledModalProps {
    isTopUpOpen: boolean;
    setTopUpOpen: (open: boolean) => void;
}

interface RefilledItemProps {
    icon: React.ReactNode;
    name: string;
    text: string;
    active?: boolean;
    href?: string;
}

const RefilledItem = ({ icon, name, text, active }: RefilledItemProps) => {
    return (
        <Link
            href={active ? "/refilled" : "#"}
            aria-disabled={!active}
            className={`flex items-center justify-between gap-[1rem] py-[1.7rem] px-[1.6rem] rounded-[1.5rem]  ${
                active ? "bg-white box-shadow" : "bg-[#F2F3F4] pointer-events-none"
            }`}
        >
            <div className="flex items-center gap-[1rem] ">
                <div
                    className={`p-[0.75rem]  rounded-[1rem] ${
                        active ? "bg-[#E5F1FF] text-[var(--blue)]" : "bg-[#9C9DA4] text-white"
                    }`}
                >
                    {icon}
                </div>
                <div>
                    <h3 className="text-[1.5rem] leading-[130%] font-semibold">{name}</h3>
                    <p className="text-[1.4rem] leading-[130%] text-[var(--gray)]">{text}</p>
                </div>
            </div>
            {active && <RightArrowIcon />}
        </Link>
    );
};
const RefilledModal = ({ isTopUpOpen, setTopUpOpen }: RefilledModalProps) => {
    return (
        <Modal open={isTopUpOpen} onClose={() => setTopUpOpen(false)}>
            <div>
                <h2 className="fs-bold text-center mb-[1rem] text-[#08091C]">Пополнить</h2>
                <p className="fs-regular text-center mb-[3rem]">Как вы хотите получить криптовалюту на Lynx Wallet</p>
            </div>
            <div className="w-full flex flex-col gap-[1rem]">
                {MOCK_WAYS?.filter((item) => item.active).map((item, index) => (
                    <RefilledItem key={index} icon={item.icon} name={item.name} text={item.text} active={item.active} />
                ))}
            </div>
            {MOCK_WAYS?.filter((item) => item.active).length > 0 && (
                <>
                    <p className="text-[1.4rem] leading-[130%] mb-[1rem] mt-[3rem] text-[var(--gray)] w-full">Скоро</p>
                    <div className="w-full flex flex-col gap-[1rem]">
                        {MOCK_WAYS?.filter((item) => !item.active).map((item, index) => (
                            <RefilledItem
                                key={index}
                                icon={item.icon}
                                name={item.name}
                                text={item.text}
                                active={item.active}
                            />
                        ))}
                    </div>
                </>
            )}
        </Modal>
    );
};

export default RefilledModal;
