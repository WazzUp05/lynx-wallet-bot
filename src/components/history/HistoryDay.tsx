import React from "react";
import HistoryItem from "./HistoryItem";

export type HistoryItemType = {
    id: number;
    type: string;
    amount: number;
    sent_amount: number;
    commission: number;
    transaction_hash: string;
    transaction_id: string;
    receiver: string;
    status: string;
    merchant_id: number;
    created_at: string;
    updated_at: string;
};

export type HistoryDayType = {
    date: string;
    items: HistoryItemType[];
};

type HistoryDayProps = {
    item: HistoryDayType;
};

function HistoryDay({ item }: HistoryDayProps) {
    const dateConverter = new Intl.DateTimeFormat("ru-RU", { dateStyle: "long" });

    return (
        <div>
            <div className="text-[1.8rem] leading-[130%] font-semibold text-[var(--text-secondary)] mb-[1.6rem]">
                {dateConverter.format(new Date(item.date))}
            </div>
            <div className="flex flex-col gap-[1rem]">
                {item.items && item.items.map((item, idx) => <HistoryItem key={idx} item={item} />)}
            </div>
        </div>
    );
}

export default HistoryDay;
