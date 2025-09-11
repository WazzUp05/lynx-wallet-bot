import React from "react";
import { HistoryItemType } from "./HistoryDay";
import SendIcon from "@/components/icons/send.svg";
import QrIcon from "@/components/icons/qr.svg";
import CardIcon from "@/components/icons/card.svg";
import PlusIcon from "@/components/icons/plus.svg";
import ArrowUpIcon from "@/components/icons/arrow-up.svg";
import ClockIcon from "@/components/icons/clock-small.svg";
import Link from "next/link";

type HistoryItemProps = {
    item: HistoryItemType;
};

const HistoryItem = ({ item }: HistoryItemProps) => {
    const getTypeImage = (type: string) => {
        switch (type) {
            case "withdrawal":
                return <ArrowUpIcon />;
            case "qrcode":
                return <QrIcon />;
            case "replenishment":
                return <PlusIcon />;
            case "sale":
                return <CardIcon />;
            case "transfer":
                return <SendIcon />;
            default:
                return null;
        }
    };

    const getTitle = (type: string) => {
        switch (type) {
            case "withdrawal":
                return "Вывод";
            case "qrcode":
                return "Покупка";
            case "replenishment":
                return "Пополнение";
            case "sale":
                return "Продажа";
            case "transfer":
                return "Перевод";
            default:
                return null;
        }
    };

    return (
        <Link
            href={`/history/${item.id}`}
            className="py-[1rem] px-[1.6rem] items-center bg-white rounded-[1.5rem] box-shadow flex  gap-[1rem]"
        >
            <div className="w-[4rem] h-[4rem] text-[#007AFF] bg-[#E5F0FF] rounded-full flex items-center justify-center">
                {getTypeImage(item.type)}
            </div>
            <div className="flex flex-col ">
                <p className="text-[1.5rem] leading-[130%] font-semibold">{getTitle(item.type)}</p>
                <p className="text-[1.5rem] leading-[130%] text-[#9C9DA4] max-w-[12.3rem] truncate">{item.text}</p>
            </div>
            <div className="flex flex-col items-end justify-between flex-1">
                <div className="text-[1.5rem] leading-[130%] font-semibold">
                    {item.amount} {item.currency}
                </div>

                {item.status === "pending" ? (
                    <div className="text-[1.2rem] flex items-center gap-[0.3rem] leading-[130%] text-[#FF9500]">
                        В обработке <ClockIcon />
                    </div>
                ) : item.status === "completed" ? (
                    <div className="text-[1.2rem] leading-[130%] text-[#34C759]">Успешно</div>
                ) : (
                    <div className="text-[1.2rem] leading-[130%] text-[#9C9DA4]">{item.status}</div>
                )}
            </div>
        </Link>
    );
};

export default HistoryItem;
