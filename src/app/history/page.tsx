"use client";
import HistoryDay from "@/components/history/HistoryDay";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import Image from "next/image";
import React, { useEffect } from "react";
import PlusIcon from "@/components/icons/plus.svg";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchHistory } from "@/lib/redux/thunks/historyThunks";
import { getHistory } from "@/lib/redux/selectors/historySelectors";

const typeLabels: Record<string, string> = {
    withdrawal: "Вывод",
    qrcode: "Покупка",
    sale: "Продажа",
    replenishment: "Пополнение",
    transfer: "Перевод",
    topups: "Обмены",
    payment: "Оплата",
};

const Page = () => {
    const dispatch = useAppDispatch();
    const historyItems = useAppSelector(getHistory);

    useEffect(() => {
        dispatch(fetchHistory());
    }, [dispatch]);

    // Группировка по дням (пример, если API не группирует)
    const historyByDay = React.useMemo(() => {
        const map: Record<string, any[]> = {};
        historyItems.forEach((item) => {
            const date = item.created_at.split(" ")[0];
            if (!map[date]) map[date] = [];
            map[date].push(item);
        });
        return Object.entries(map).map(([date, items]) => ({ date, items }));
    }, [historyItems]);

    const allTypes = Array.from(new Set(historyItems.map((item) => item.type)));
    const tabs = [
        { label: "Все", value: "all" },
        ...allTypes.map((type) => ({ label: typeLabels[type] || type, value: type })),
    ];

    const [selectedTab, setSelectedTab] = React.useState("all");
    const handleTabChange = (value: string) => setSelectedTab(value);

    const filteredHistory =
        selectedTab === "all"
            ? historyByDay
            : historyByDay
                  .map((day) => ({
                      ...day,
                      items: day.items.filter((item) => item.type === selectedTab),
                  }))
                  .filter((day) => day.items.length > 0);

    return (
        <div className="px-[1.6rem] py-[2rem] w-full bg-white min-h-[100dvh] flex flex-col">
            <h1 className="text-[2.5rem] leading-[130%] font-semibold  mb-[2rem]">История транзакций</h1>
            {filteredHistory?.length > 0 && (
                <Tabs tabs={tabs} value={selectedTab} onChange={handleTabChange} className="mb-[3rem]" />
            )}
            {filteredHistory?.length > 0 ? (
                <div className="flex flex-col gap-[3rem] overflow-y-auto h-full pb-[7rem] px-[0.2rem]">
                    {filteredHistory.map((section) => (
                        <HistoryDay key={section.date} item={section} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center h-full flex-1">
                    <Image
                        src="/history-img.png"
                        alt="No data"
                        width={293}
                        height={85}
                        className="mb-[4.4rem] w-[29.3rem] h-[8.5rem]"
                    />
                    <h2 className="text-[2.5rem] leading-[130%] font-semibold text-center mb-[1rem]">
                        История транзакций
                    </h2>
                    <p className="text-[1.6rem] leading-[130%]  text-center mb-[3rem]">
                        Здесь вы увидите все свои финансовые операции.
                    </p>
                    <Button variant="primary" className="flex items-center justify-center gap-[0.5rem]">
                        <PlusIcon /> Пополнить кошелёк
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Page;
