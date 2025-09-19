"use client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import ArrowLeft from "@/components/icons/arrow-left.svg";
import SendIcon from "@/components/icons/send.svg";
import QrIcon from "@/components/icons/qr.svg";
import CardIcon from "@/components/icons/card.svg";
import PlusIcon from "@/components/icons/plus.svg";
import ArrowUpIcon from "@/components/icons/arrow-up.svg";
import CheckIcon from "@/components/icons/check-green.svg";
import CopyIcon from "@/components/icons/copy.svg";
import QuestionIcon from "@/components/icons/question.svg";
import { Toast } from "@/components/ui/Toast";
import { useState } from "react";
import TaxModal from "@/components/modals/TaxModal";
import { getLoading } from "@/lib/redux/selectors/userSelectors";
import { useAppSelector } from "@/lib/redux/hooks";
import Loader from "@/components/ui/Loader";

// Моковые данные для примера
const MOCK_HISTORY = [
    {
        id: "1",
        type: "transfer",
        amount: -1.0,
        currency: "USDT",
        amountWrite: "1.0 USDT",
        status: "completed",
        date: "02.09.2025",
        time: "16:43",
        tax: "-2.5 USDT",
        hash: "ANDasdC-4boDasVsadaaCasdvcAsd",
        txid: "ANTRC-4boePKOznDdxaaCasdvcAsd",
        to: "TPMMFQEFdasF321fSjScYfr1L",
        fee: "0 USDT",
        url: "google.ru",
    },
    // ... другие транзакции
];

export default function HistoryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params as { id: string };
    const tx = MOCK_HISTORY.find((item) => item.id === id);
    const loadingApp = useAppSelector(getLoading);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [showModal, setShowModal] = useState(false);

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

    const handleCopy = (text: string, msg: string) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                setToastMsg(msg);
                setToastOpen(true);
            });
        } else {
            // Fallback для Safari/WebView
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                document.execCommand("copy");
                setToastMsg(msg);
                setToastOpen(true);
            } catch (err) {
                setToastMsg("Не удалось скопировать");
                setToastOpen(true);
            }
            document.body.removeChild(textarea);
        }
    };

    const handleLinkClick = (url: string) => {
        window.open(url, "_blank");
    };

    if (loadingApp) {
        return <Loader className="h-[100dvh]" />;
    }

    if (!tx) return <div className="p-8">Транзакция не найдена</div>;

    return (
        <div className="min-h-[100dvh]  flex flex-col items-center px-[1.6rem] py-[2rem]">
            <Toast open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />
            <div className="flex items-center justify-center relative text-[1.8rem] leading-[130%] mb-[2rem] font-semibold w-full">
                <button className="absolute left-0 top-1/2 -translate-y-1/2" onClick={() => router.back()}>
                    <ArrowLeft />
                </button>
                <span>Перевод</span>
            </div>
            <div className="w-full flex flex-col items-center ">
                <div className="flex flex-col items-center mb-[3rem]">
                    <div className="w-[6rem] h-[6rem] text-[#007AFF] bg-[#E5F0FF] rounded-full flex items-center justify-center mb-[1rem]">
                        {getTypeImage(tx.type)}
                    </div>
                    <div className="text-[2.1rem] font-semibold mb-[1rem]">
                        {tx.amount} {tx.currency}
                    </div>
                    {tx.status === "completed" ? (
                        <div className="flex items-center py-[0.55rem] px-[1rem] gap-[0.55rem] box-shadow rounded-[1.5rem] mb-2">
                            <div className=" text-[1.2rem] leading-[130%] flex items-center gap-[0.5rem] font-semibold">
                                <CheckIcon /> Успешно
                            </div>
                        </div>
                    ) : tx.status === "pending" ? (
                        <div className="flex items-center py-[0.55rem] px-[0.75rem] gap-[0.55rem] box-shadow rounded-[1.5rem] mb-2">
                            <div className="text-yellow-600 text-[1.2rem]  flex items-center gap-[0.5rem] font-semibold">
                                В обработке
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center py-[0.55rem] px-[0.75rem] gap-[0.55rem] box-shadow rounded-[1.5rem] mb-2">
                            <div className="text-red-600 text-[1.2rem]  flex items-center gap-[0.5rem] font-semibold">
                                Ошибка
                            </div>
                        </div>
                    )}
                </div>
                <div className="w-full flex flex-col gap-[1rem] bg-white rounded-[1.5rem] box-shadow p-[1.6rem] mb-[1rem]">
                    {tx.amountWrite && (
                        <div className="w-full flex justify-between text-sm">
                            <span className="text-[#9C9DA4] text-[1.4rem] leading-[130%]">Сумма списания</span>
                            <span className="font-semibold text-[1.4rem] leading-[130%]">{tx.amountWrite}</span>
                        </div>
                    )}
                    {tx.amount && (
                        <div className="w-full flex justify-between text-sm">
                            <span className="text-[#9C9DA4] text-[1.4rem] leading-[130%]">Отправлено</span>
                            <span className="font-semibold text-[1.4rem] leading-[130%]">
                                {tx.amount} {tx.currency}
                            </span>
                        </div>
                    )}

                    {tx.tax && (
                        <div className="w-full  flex justify-between text-sm">
                            <span className="text-[#9C9DA4] text-[1.4rem] leading-[130%]">Комиссия</span>
                            <span className="font-semibold text-[1.4rem] leading-[130%] flex items-center gap-[1rem]">
                                {tx.tax}
                                <div onClick={() => setShowModal(true)} className="relative top-[-0.2rem]">
                                    <QuestionIcon />
                                </div>
                            </span>
                        </div>
                    )}
                </div>
                <div className="w-full flex flex-col gap-[1rem] bg-white rounded-[1.5rem] box-shadow p-[1.6rem] mb-[1rem]">
                    {tx?.date && (
                        <div className="flex justify-between mb-1">
                            <span className="text-[#9C9DA4] text-[1.4rem] leading-[130%]">Дата и время</span>
                            <span className="font-semibold text-[1.4rem] leading-[130%]">
                                {tx.date} {tx.time}
                            </span>
                        </div>
                    )}

                    {tx?.hash && (
                        <div className="flex justify-between mb-1">
                            <span className="text-[#9C9DA4] text-[1.4rem] leading-[130%]">Хэш транзакции</span>
                            <span className="font-semibold text-[1.4rem] leading-[130%] flex items-center gap-[0.5rem]">
                                <span className="max-w-[14.4rem] truncate">{tx.hash}</span>
                                <button onClick={() => handleCopy(tx.hash, "Хэш скопирован")}>
                                    <CopyIcon />
                                </button>
                            </span>
                        </div>
                    )}
                    {tx?.txid && (
                        <div className="flex justify-between mb-1">
                            <span className="text-[#9C9DA4] text-[1.4rem] leading-[130%]">ID транзакции</span>
                            <span className="font-semibold text-[1.4rem] leading-[130%] flex items-center gap-[0.5rem]">
                                <span className="max-w-[14.4rem] truncate">{tx.txid}</span>
                                <button onClick={() => handleCopy(tx.txid, "ID скопирован")}>
                                    <CopyIcon />
                                </button>
                            </span>
                        </div>
                    )}
                </div>
                {tx?.to && (
                    <div className="w-full flex flex-col gap-[1rem] bg-white rounded-[1.5rem] box-shadow p-[1.6rem] mb-[1rem]">
                        <div className="flex justify-between">
                            <span className="text-[#9C9DA4] text-[1.4rem] leading-[130%]">Получатель</span>
                            <span className="font-semibold text-[1.4rem] leading-[130%] flex items-center  gap-[0.5rem]">
                                <span className="max-w-[14.4rem] truncate">{tx.to}</span>
                                <button onClick={() => handleCopy(tx.to, "Адрес скопирован")}>
                                    <CopyIcon />
                                </button>
                            </span>
                        </div>
                    </div>
                )}
                {tx?.type === "withdrawal" && (
                    <div className="text-[1.2rem] flex items-center rounded-[1.5rem] gap-[1.5rem] leading-[130%] font-medium bg-[#E4F4EF] py-[1.4rem] px-[2.6rem] mt-[2rem]">
                        <CheckIcon /> AML проверка успешно завершена
                    </div>
                )}
            </div>
            {tx.url && (
                <Button onClick={() => handleLinkClick(tx.url)} className="w-full mt-[3rem]" variant="black">
                    Открыть в обозревателе
                </Button>
            )}
            <TaxModal showModal={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
}
