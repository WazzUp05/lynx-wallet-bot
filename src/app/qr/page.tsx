"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import QrScanner from "@/components/QrScanner";
import Modal from "@/components/Modal";
import RubleIcon from "@/components/icons/ruble.svg";
import UsdtIcon from "@/components/icons/usdt.svg";
import ArrowRightIcon from "@/components/icons/right-arrow.svg";
import SelectCrypto from "@/components/SelectCrypto";
import { useAppSelector } from "@/lib/redux/hooks";
import { getRatesQuoteRub } from "@/lib/redux/selectors/rateSelectors";

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
    const [modalOpen, setModalOpen] = useState(false);

    // 1. Получаем курс USDT/RUB из редакса
    const usdtRate = useAppSelector(getRatesQuoteRub) ?? 0;

    // 2. Парсим сумму из QR
    let rubAmount = 0;
    if (scanned) {
        const match = scanned.match(/sum=(\d+)/);
        if (match) {
            rubAmount = parseInt(match[1], 10) / 100;
        }
    }

    // 3. Считаем сумму в USDT
    const usdtAmount = usdtRate && rubAmount ? +(rubAmount / usdtRate).toFixed(4) : 0;

    const handleCopy = async () => {
        if (scanned) {
            alert("Адрес скопирован в буфер обмена: " + scanned);
            await navigator.clipboard.writeText(scanned);
            setToast(true);
            setTimeout(() => setToast(false), 2000);
        }
    };

    const onNewScanResult = (decodedText: string) => {
        alert(`QR Code detected: ${decodedText}`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <>
                <div className="rounded-2xl overflow-hidden mb-4 bg-[#e5e5e5]">
                    <QrScanner
                        onResult={(result) => {
                            setScanned(result);
                            setModalOpen(true); // открываем модалку при сканировании
                        }}
                    />
                </div>
                <p className="text-center text-gray-500 mb-2">Наведите камеру на QR-код</p>
            </>

            <Modal title="Оплатить" closable swipeToClose={false} open={modalOpen} onClose={() => setModalOpen(false)}>
                <div className="flex flex-col items-center w-full ">
                    <div className="flex flex-col w-full mb-[1rem] gap-[1rem] box-shadow p-[1.6rem] rounded-[1.5rem] bg-white">
                        <div className="flex items-center justify-between w-full  ">
                            <p className="text-[1.4rem] leading-[130%] text-[var(--gray)]">Сумма</p>
                            <p className="text-[1.4rem] font-semibold leading-[130%]">
                                {" "}
                                {rubAmount ? rubAmount.toFixed(2) : "--"} RUB
                            </p>
                        </div>
                        <div className="flex items-center justify-between w-full  ">
                            <p className="text-[1.4rem] leading-[130%] text-[var(--gray)]">Курс обмена</p>
                            <p className="text-[1.4rem] font-semibold leading-[130%] flex items-center gap-[0.4rem]">
                                <span className="flex items-center gap-[0.4rem]">
                                    <UsdtIcon /> 1 USDT
                                </span>
                                <ArrowRightIcon />{" "}
                                <span className="flex items-center gap-[0.4rem]">
                                    <RubleIcon /> {usdtRate ? usdtRate.toFixed(2) : "--"} RUB
                                </span>{" "}
                            </p>
                        </div>
                        <div className="flex items-center justify-between w-full  ">
                            <p className="text-[1.4rem] leading-[130%] text-[var(--gray)]">Обновится через</p>
                            <p className="text-[1.4rem] font-semibold leading-[130%] text-[#007AFF]">23 сек</p>
                        </div>
                    </div>
                    <SelectCrypto cryptos={MOCK_SELECT_CRYPTO} />
                    <div className="flex items-center justify-between w-full mt-[2rem] mb-[3rem]">
                        <div className="flex flex-col text-[1.5rem] leading-[130%] ">
                            <p className="font-semibold">Итого:</p>
                            <p className="text-[var(--gray)]">Комиссия 0%</p>
                        </div>
                        <p className="text-[2.5rem] font-semibold leading-[130%]">
                            {" "}
                            {usdtAmount ? usdtAmount : "--"} USDT
                        </p>
                    </div>
                    <p className="break-all mb-4">{scanned}</p>
                    <Button variant="primary" onClick={handleCopy} className="mb-2">
                        Оплатить
                    </Button>
                </div>
            </Modal>
            {toast && <Toast open={toast} message="Адрес скопирован" onClose={() => setToast(false)} />}
        </div>
    );
}
