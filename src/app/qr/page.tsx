"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import QrScanner from "@/components/QrScanner";
import Modal from "@/components/Modal";
import RubleIcon from "@/components/icons/ruble.svg";
import UsdtIcon from "@/components/icons/usdt.svg";
import ArrowRightIcon from "@/components/icons/right-arrow.svg";
import SelectCrypto from "@/components/SelectCrypto";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getRatesQuoteRub } from "@/lib/redux/selectors/rateSelectors";
import { fetchRates } from "@/lib/redux/thunks/rateThunks";

const MOCK_SELECT_CRYPTO = [
    {
        id: "USDT",
        label: "USDT",
        description: "0.0 USDT",
        iconUrl: "/icons/usdt.svg",
    },
    {
        id: "TON",
        label: "TON",
        description: "0.0 TON",
        iconUrl: "/icons/ton.svg",
    },
];

export default function QrScanPage() {
    const [scanned, setScanned] = useState<string | null>(null);
    const [toast, setToast] = useState(false);
    const [modalOpen, setModalOpen] = useState(true);
    const [timer, setTimer] = useState(30);
    const dispatch = useAppDispatch();

    // Получаем курс USDT/RUB из редакса
    const usdtRate = useAppSelector(getRatesQuoteRub);

    useEffect(() => {
        console.log("usdtRate", usdtRate);
    }, [usdtRate]);

    // Парсим сумму из QR и считаем итоговые значения
    const { rubAmount, usdtAmount } = useMemo(() => {
        let rub = 0;
        if (scanned) {
            const match = scanned.match(/sum=(\d+)/);
            if (match) rub = parseInt(match[1], 10) / 100;
        }
        const usdt = usdtRate && rub ? +(rub / usdtRate).toFixed(4) : 0;
        return { rubAmount: rub, usdtAmount: usdt };
    }, [scanned, usdtRate]);

    // Обработка копирования
    const handleCopy = async () => {
        if (scanned) {
            await navigator.clipboard.writeText(scanned);
            setToast(true);
            setTimeout(() => setToast(false), 2000);
        }
    };

    // Открываем модалку при сканировании
    const handleScan = (result: string) => {
        setScanned(result);
        setModalOpen(true);
    };

    // Запуск таймера и обновление курса
    useEffect(() => {
        if (!modalOpen) return;
        if (timer === 0) {
            dispatch(fetchRates());
            setTimer(30);
            return;
        }
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [timer, modalOpen, dispatch]);

    // Сброс таймера при открытии модалки
    useEffect(() => {
        if (modalOpen) setTimer(30);
    }, [modalOpen]);

    const handlePay = async () => {
        alert("Платеж в разработке");
        const order = {
            amount: 22,
            amount_usdt: 0.001,
            merchant_id: 1,
            rate: 22.22,
            url: "test.com",
        };

        // alert("Симуляция оплаты:\n" + JSON.stringify(order, null, 2));

        try {
            const res = await fetch("https://stage.lynx-wallet.com/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(order),
            });
            const data = await res.json();
            // обработай ответ, например, показать статус или перейти на страницу оплаты
            alert(data);
        } catch (e) {
            console.error("Order error:", e);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div className="rounded-2xl overflow-hidden mb-4 bg-[#e5e5e5]">
                <QrScanner onResult={handleScan} />
            </div>
            <p className="text-center text-gray-500 mb-2">Наведите камеру на QR-код</p>
            <p className="text-center text-gray-400 text-sm mb-4 px-4">{usdtAmount ? usdtAmount.toFixed(4) : "--"}</p>
            <span className="flex items-center gap-[0.4rem]">
                <RubleIcon /> {usdtRate ? usdtRate.toFixed(2) : "--"} RUB
            </span>
            <Modal title="Оплатить" closable swipeToClose={false} open={modalOpen} onClose={() => setModalOpen(false)}>
                <div className="flex flex-col items-center w-full">
                    <div className="flex flex-col w-full mb-[1rem] gap-[1rem] box-shadow p-[1.6rem] rounded-[1.5rem] bg-white">
                        <div className="flex items-center justify-between w-full">
                            <p className="text-[1.4rem] leading-[130%] text-[var(--gray)]">Сумма</p>
                            <p className="text-[1.4rem] font-semibold leading-[130%]">
                                {rubAmount ? rubAmount.toFixed(2) : "--"} RUB
                            </p>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <p className="text-[1.4rem] leading-[130%] text-[var(--gray)]">Курс обмена</p>
                            <p className="text-[1.4rem] font-semibold leading-[130%] flex items-center gap-[0.4rem]">
                                <span className="flex items-center gap-[0.4rem]">
                                    <UsdtIcon /> 1 USDT
                                </span>
                                <ArrowRightIcon />
                                <span className="flex items-center gap-[0.4rem]">
                                    <RubleIcon /> {usdtRate ? usdtRate.toFixed(2) : "--"} RUB
                                </span>
                            </p>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <p className="text-[1.4rem] leading-[130%] text-[var(--gray)]">Обновится через</p>
                            <p className="text-[1.4rem] font-semibold leading-[130%] text-[#007AFF]">{timer} сек</p>
                        </div>
                    </div>
                    <SelectCrypto cryptos={MOCK_SELECT_CRYPTO} />
                    <div className="flex items-center justify-between w-full mt-[2rem] mb-[3rem]">
                        <div className="flex flex-col text-[1.5rem] leading-[130%]">
                            <p className="font-semibold">Итого:</p>
                            <p className="text-[var(--gray)]">Комиссия 0%</p>
                        </div>
                        <p className="text-[2.5rem] font-semibold leading-[130%]">
                            {usdtAmount ? usdtAmount : "--"} USDT
                        </p>
                    </div>
                    <p className="break-all mb-4">{scanned}</p>
                    <Button variant="primary" onClick={handlePay} className="mb-2">
                        Оплатить
                    </Button>
                </div>
            </Modal>
            {toast && <Toast open={toast} message="Адрес скопирован" onClose={() => setToast(false)} />}
        </div>
    );
}
