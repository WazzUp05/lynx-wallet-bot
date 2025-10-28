'use client';
import HistoryDay from '@/components/history/HistoryDay';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import Image from 'next/image';
import React, { useEffect } from 'react';
import PlusIcon from '@/components/icons/plus.svg';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchHistory } from '@/lib/redux/thunks/historyThunks';
import { getHistory } from '@/lib/redux/selectors/historySelectors';
import { getLoading } from '@/lib/redux/selectors/userSelectors';
import Loader from '@/components/ui/Loader';
import Link from 'next/link';

interface HistoryItem {
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
}

interface HistoryDaySection {
    date: string;
    items: HistoryItem[];
}

const typeLabels: Record<string, string> = {
    withdrawal: 'Вывод',
    qrcode: 'Покупка',
    sale: 'Продажа',
    replenishment: 'Пополнение',
    transfer: 'Перевод',
    topups: 'Обмены',
    payment: 'Оплата',
};

const Page = () => {
    const dispatch = useAppDispatch();
    const historyItems = useAppSelector(getHistory) as HistoryItem[];
    const loadingApp = useAppSelector(getLoading);
    const user = useAppSelector((state) => state.user.data);
    const [historyLoading, setHistoryLoading] = React.useState(true);

    useEffect(() => {
        if (user && user.id) {
            setHistoryLoading(true);
            dispatch(fetchHistory()).finally(() => setHistoryLoading(false));
        }
    }, [dispatch, user?.id]);

    // Группировка по дням
    const historyByDay: HistoryDaySection[] = React.useMemo(() => {
        const map: Record<string, HistoryItem[]> = {};
        historyItems.forEach((item) => {
            const date = item.created_at.split(' ')[0];
            if (!map[date]) map[date] = [];
            map[date].push(item);
        });
        return Object.entries(map).map(([date, items]) => ({ date, items }));
    }, [historyItems]);

    const allTypes = Array.from(new Set(historyItems.map((item) => item.type)));
    const tabs = [
        { label: 'Все', value: 'all' },
        ...allTypes.map((type) => ({ label: typeLabels[type] || type, value: type })),
    ];

    const [selectedTab, setSelectedTab] = React.useState('all');
    const handleTabChange = (value: string) => setSelectedTab(value);

    // Map HistoryItem to HistoryItemType
    const mapToHistoryItemType = (item: HistoryItem) => ({
        ...item,
        currency: 'RUB', // or derive from item if available
        title: typeLabels[item.type] || item.type,
        text: `ID транзакции: ${item.transaction_id}`,
        date: item.created_at.split(' ')[0],
        time: item.created_at.split(' ')[1] || '',
    });

    const filteredHistory: HistoryDaySection[] =
        selectedTab === 'all'
            ? historyByDay
            : historyByDay
                  .map((day) => ({
                      ...day,
                      items: day.items.filter((item) => item.type === selectedTab),
                  }))
                  .filter((day) => day.items.length > 0);

    // Convert to HistoryDayType[]
    const filteredHistoryDayType = filteredHistory.map((section) => ({
        ...section,
        items: section.items.map(mapToHistoryItemType),
    }));

    if (loadingApp || historyLoading) {
        return <Loader className="h-[100dvh]" />;
    }

    return (
        <div className="px-[1.6rem] py-[2rem] w-full bg-[var(--bg-optional)] min-h-[100dvh] flex flex-col pb-[calc(var(--safe-bottom)+1.6rem)]">
            {filteredHistoryDayType?.length > 0 && (
                <h1 className="text-[2.5rem] leading-[130%] font-semibold  mb-[2rem]">История транзакций</h1>
            )}
            {filteredHistoryDayType?.length > 0 && (
                <Tabs tabs={tabs} value={selectedTab} onChange={handleTabChange} className="mb-[3rem]" />
            )}
            {filteredHistoryDayType?.length > 0 ? (
                <div className="flex flex-col gap-[3rem] overflow-y-auto h-full pb-[7rem] px-[0.2rem]">
                    {filteredHistoryDayType.map((section) => (
                        <HistoryDay key={section.date} item={section} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center h-full flex-1">
                    <Image
                        src="/history-img.png"
                        alt="No data"
                        width={293 * 2}
                        height={52 * 2}
                        className="mb-[4.4rem] w-[29.3rem] "
                    />
                    <h2 className="text-[2.5rem] leading-[130%] font-semibold text-center mb-[1.2rem]">
                        История транзакций
                    </h2>
                    <p className="text-[1.6rem] max-w-[26rem] mx-auto leading-[130%]  text-center mb-[3.2rem]">
                        Здесь вы увидите все свои финансовые операции.
                    </p>
                    <Link href="/refilled" className="w-full">
                        <Button
                            variant="yellow"
                            fullWidth
                            className="flex text-[var(--bg-secondary)] items-center justify-center gap-[0.5rem]"
                        >
                            <PlusIcon width={25} height={25} className="w-[2.5rem] h-[2.5rem]" /> Пополнить кошелёк
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Page;
