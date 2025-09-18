"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import { getLoading, getUser, getWallet } from "@/lib/redux/selectors/userSelectors";

export default function QrScanPage() {
    const [scanned, setScanned] = useState<string | null>(null);
    const [toast, setToast] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [timer, setTimer] = useState(30);
    const [loadingQr, setLoadingQr] = useState(false);
    const [qrInfo, setQrInfo] = useState<{ rubAmount: number; usdtAmount: number } | null>(null);
    const loadingApp = useAppSelector(getLoading);
    const user = useAppSelector(getUser);
    const [toastMsg, setToastMsg] = useState("");
    const dispatch = useAppDispatch();
    const router = useRouter();
    const wallet = useAppSelector(getWallet);
    const balance_usdt = useCallback(() => wallet?.balance_usdt, [wallet])();
    const usdtRate = useAppSelector(getRatesQuoteRub);

    const merchant_id = user.data?.id;

    const MOCK_SELECT_CRYPTO = [
        {
            id: "USDT",
            label: "USDT",
            description: balance_usdt ? `${balance_usdt} USDT` : "0.00 USDT",
            iconUrl: "/icons/usdt.svg",
        },
        // {
        //     id: "TON",
        //     label: "TON",
        //     description: "0.0 TON",
        //     iconUrl: "/icons/ton.svg",
        // },
    ];

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

    // Открываем модалку при сканировании
    const handleScan = async (result: string) => {
        setScanned(result);

        // Проверяем, есть ли параметр sum
        const sumMatch = result.match(/sum=(\d+)/);
        if (sumMatch) {
            // Вариант 1: сумма есть в ссылке
            const rub = parseInt(sumMatch[1], 10) / 100;
            const usdt = usdtRate && rub ? +(rub / usdtRate).toFixed(4) : 0;
            setQrInfo({ rubAmount: rub, usdtAmount: usdt });
            setModalOpen(true);
            setLoadingQr(false);
        } else {
            // Вариант 2: суммы нет, нужно запросить prepare
            setLoadingQr(true);
            const codeMatch = result.match(/qr\.nspk\.ru\/([^?]+)/);
            const code = codeMatch ? codeMatch[1] : null;
            if (code) {
                try {
                    const res = await fetch(`https://qr.lynx-wallet.com/prepare/${code}`);
                    const data = await res.json();
                    if (data.success && data.amount_rub) {
                        const rub = parseFloat(data.amount_rub);
                        const usdt = usdtRate && rub ? +(rub / usdtRate).toFixed(4) : 0;
                        setQrInfo({ rubAmount: rub, usdtAmount: usdt });
                        setModalOpen(true);
                    } else {
                        setToastMsg("Не удалось получить сумму по QR");
                        setToast(true);
                        setTimeout(() => setToast(false), 2000);
                    }
                } catch (e) {
                    let errorMsg = "Ошибка запроса prepare";
                    if (e instanceof Error && e.message) {
                        errorMsg += `: ${e.message}`;
                    }
                    setToastMsg(errorMsg);
                    setToast(true);
                    setTimeout(() => setToast(false), 2000);
                }
            } else {
                setToastMsg("Некорректный QR-код");
                setToast(true);
                setTimeout(() => setToast(false), 2000);
            }
            setLoadingQr(false);
        }
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
        if (!qrInfo) return;
        const order = {
            amount: qrInfo.rubAmount,
            amount_usdt: qrInfo.usdtAmount,
            merchant_id,
            rate: usdtRate.toFixed(2),
            url: scanned,
        };

        // alert(JSON.stringify(order, null, 2));

        try {
            const res = await fetch("https://stage.lynx-wallet.com/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(order),
            });
            const data = await res.json();

            if (data.success === false) {
                setToast(true);
                setTimeout(() => setToast(false), 2000);
                // Можно сохранить текст сообщения для Toast:
                setToastMsg(data.message || "Ошибка при создании заявки");
                return;
            }

            if (data.success && data.data?.uuid) {
                router.push(`/qr/status/${data.data.uuid}`);
            }
        } catch (e) {
            console.error("Order error:", e);
        }
    };

    if (loadingApp) {
        return <Loader className="h-[100dvh]" />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            {toast && <Toast open={toast} message={toastMsg} type="error" onClose={() => setToast(false)} />}
            <div className="rounded-2xl overflow-hidden mb-4 bg-[#e5e5e5]">
                <QrScanner onResult={handleScan} paused={loadingQr} torch finder zoom={true} />
            </div>
            <p className="text-center text-gray-500 mb-2">Наведите камеру на QR-код</p>
            {/* <span className="flex items-center gap-[0.4rem]">
                <RubleIcon /> {usdtRate ? usdtRate.toFixed(2) : "--"} RUB
            </span> */}
            {loadingQr && <Loader className="h-[4rem]" />}
            <Modal title="Оплатить" closable swipeToClose={false} open={modalOpen} onClose={() => setModalOpen(false)}>
                <div className="flex flex-col items-center w-full">
                    {loadingQr || !qrInfo ? (
                        <Loader className="h-[10rem]" />
                    ) : (
                        <>
                            <div className="flex flex-col w-full mb-[1rem] gap-[1rem] box-shadow p-[1.6rem] rounded-[1.5rem] bg-white">
                                <div className="flex items-center justify-between w-full">
                                    <p className="text-[1.4rem] leading-[130%] text-[var(--gray)]">Сумма</p>
                                    <p className="text-[1.4rem] font-semibold leading-[130%]">
                                        {qrInfo.rubAmount ? qrInfo.rubAmount.toFixed(2) : "--"} RUB
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
                                    <p className="text-[1.4rem] font-semibold leading-[130%] text-[#007AFF]">
                                        {timer} сек
                                    </p>
                                </div>
                            </div>
                            <SelectCrypto cryptos={MOCK_SELECT_CRYPTO} />
                            <div className="flex items-center justify-between w-full mt-[2rem] mb-[3rem]">
                                <div className="flex flex-col text-[1.5rem] leading-[130%]">
                                    <p className="font-semibold">Итого:</p>
                                    <p className="text-[var(--gray)]">Комиссия 0%</p>
                                </div>
                                <p className="text-[2.5rem] font-semibold leading-[130%]">
                                    {qrInfo.usdtAmount ? qrInfo.usdtAmount : "--"} USDT
                                </p>
                            </div>
                            <Button
                                variant="primary"
                                onClick={handlePay}
                                disabled={balance_usdt ? balance_usdt < qrInfo.usdtAmount : true}
                                className="mb-2"
                            >
                                Оплатить
                            </Button>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
}
