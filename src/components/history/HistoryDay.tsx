import React from "react";
import HistoryItem from "./HistoryItem";

export type HistoryItemType = {
    id: number;
    type: string;
    amount: number;
    currency: string;
    title: string;
    text: string;
    date: string;
    time: string;
    status: string;
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
            <div className="text-[1.8rem] leading-[130%] font-semibold text-[var(--gray)] mb-[1rem]">
                {dateConverter.format(new Date(item.date))}
            </div>
            <div className="flex flex-col gap-[1rem]">
                {item.items && item.items.map((item, idx) => <HistoryItem key={idx} item={item} />)}
            </div>
        </div>
    );
}

export default HistoryDay;
