"use client";
import HistoryDay from "@/components/history/HistoryDay";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import Image from "next/image";
import React from "react";
import PlusIcon from "@/components/icons/plus.svg";

// Mock data for history
const history: Array<{
    date: string;
    items: Array<{
        id: number;
        type: string;
        amount: number;
        currency: string;
        title: string;
        text: string;
        date: string;
        time: string;
        status: string;
    }>;
}> = [
    {
        date: "2023-10-01",
        items: [
            {
                id: 1,
                type: "withdrawal",
                amount: 50,
                currency: "USD",
                title: "Withdrawal",
                text: "Withdrawal of $50",
                date: "2023-10-01",
                time: "12:00",
                status: "completed",
            },
        ],
    },
    {
        date: "2023-10-02",
        items: [
            {
                id: 2,
                type: "qrcode",
                amount: 200,
                currency: "USD",
                title: "qrcode",
                text: "qrcode of $200",
                date: "2023-10-02",
                time: "14:00",
                status: "completed",
            },
            {
                id: 3,
                type: "sale",
                amount: 200,
                currency: "USD",
                title: "Sale",
                text: "Sale of $200",
                date: "2023-10-02",
                time: "14:00",
                status: "completed",
            },
            {
                id: 4,
                type: "replenishment",
                amount: 200,
                currency: "USD",
                title: "Replenishment",
                text: "Replenishment of $200",
                date: "2023-10-02",
                time: "14:00",
                status: "completed",
            },
        ],
    },
    {
        date: "2023-10-03",
        items: [
            {
                id: 5,
                type: "transfer",
                amount: 300,
                currency: "USD",
                title: "Transfer",
                text: "Transfer of $300",
                date: "2023-10-03",
                time: "16:00",
                status: "completed",
            },
            {
                id: 6,
                type: "replenishment",
                amount: 200,
                currency: "USD",
                title: "Replenishment",
                text: "Replenishment of $200",
                date: "2023-10-02",
                time: "14:00",
                status: "pending",
            },
        ],
    },
];

const Page = () => {
    // Собираем уникальные типы из истории
    const typeLabels: Record<string, string> = {
        withdrawal: "Вывод",
        qrcode: "Покупка",
        sale: "Продажа",
        replenishment: "Пополнение",
        transfer: "Перевод",
        topups: "Обмены",
        payment: "Оплата",
    };

    const allTypes = Array.from(new Set(history.flatMap((day) => day.items.map((item) => item.type))));
    const tabs = [
        { label: "Все", value: "all" },
        ...allTypes.map((type) => ({ label: typeLabels[type] || type, value: type })),
    ];

    const [selectedTab, setSelectedTab] = React.useState("all");
    const handleTabChange = (value: string) => {
        setSelectedTab(value);
    };

    // Фильтрация истории по выбранному табу
    const filteredHistory =
        selectedTab === "all"
            ? history
            : history
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
