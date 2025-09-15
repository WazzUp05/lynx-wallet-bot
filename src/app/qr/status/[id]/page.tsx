"use client";
import { Button } from "@/components/ui/Button";
import { useRouter, useParams } from "next/navigation";
import ClockIcon from "@/components/icons/clock-bg.svg";
import CheckIcon from "@/components/icons/check-green.svg";
import CopyIcon from "@/components/icons/copy.svg";
import UsdtIcon from "@/components/icons/usdt.svg";
import RubleIcon from "@/components/icons/ruble.svg";
import ArrowRightIcon from "@/components/icons/right-arrow.svg";
import { useState } from "react";
import { Toast } from "@/components/ui/Toast";
import Image from "next/image";

interface StatusData {
    status: string;
    date: string;
    amount: string;
    exchange: string;
    id: string;
    rub: string;
}

// Моковые данные для примера
const MOCK_STATUS: Record<string, StatusData> = {
    "123": {
        status: "processing",
        date: "08.09.25, 11:52",
        amount: "-1.3906 USDT",
        exchange: "USDT → RUB",
        id: "#LYNXXWA-4boePKOzn...",
        rub: "≈ 111.25 RUB",
    },
    // ...другие id
};

export default function QrStatusPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params as { id: string };
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState("");

    const data = MOCK_STATUS[id] || {
        status: "Не найдено",
        date: "",
        amount: "",
        exchange: "",
        id: "",
        rub: "",
    };

    const handleCopy = (text: string, msg: string) => {
        navigator.clipboard.writeText(text);
        setToastMsg(msg);
        setToastOpen(true);
    };

    return (
        <div className="min-h-[100dvh] relative bg-white overflow-hidden flex flex-col items-center px-[1.6rem] py-[2rem]">
            <Toast open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />
            <div
                className={`w-[60rem] h-[60rem] absolute top-[7.4rem] left-[-33.4rem] ${
                    data.status === "completed" ? "bg-[#CBF7E9]" : "bg-[#DEEEFF]"
                } blur-[10rem] rounded-[50%] `}
            />
            <div
                className={`w-[60rem] h-[50rem] absolute top-[7.4rem] right-[-33.4rem] ${
                    data.status === "completed" ? "bg-[#CBF7E9]" : "bg-[#DEEEFF]"
                } blur-[10rem] rounded-[50%] `}
            />
            <div className="w-full max-w-[400px] mx-auto relative ">
                <div className="flex flex-col items-center  mb-[8rem]">
                    <div className=" text-[1.8rem] mb-[1rem] font-semibold">{data.status}</div>
                    <div className="text-[#9C9DA4] text-[1.4rem] mb-[6.5rem]">{data.date}</div>
                    <div className="w-[8rem] h-[8rem] rounded-full bg-[#E0EBF9] flex items-center justify-center mb-[1rem]">
                        <Image
                            src="/loading.gif"
                            alt="QR Status"
                            width={100}
                            height={100}
                            className="w-[8rem] h-[8rem]"
                        />
                    </div>
                    <div className="text-[2.5rem] font-semibold mb-[1rem]">{data.amount}</div>
                    <div className="flex items-center gap-2 mb-2">
                        {data.status === "processing" && (
                            <span className="bg-white flex items-center gap-[0.5rem] font-semibold rounded-full p-[0.7rem] text-[1.2rem] box-shadow leading-[130%]">
                                <ClockIcon /> Ожидание
                            </span>
                        )}
                        {data.status === "completed" && (
                            <span className="bg-white flex items-center gap-[0.5rem] font-semibold rounded-full p-[0.7rem] text-[1.2rem] box-shadow leading-[130%]">
                                <CheckIcon /> Успешно
                            </span>
                        )}
                    </div>
                </div>
                <div className="bg-white rounded-[1.5rem] box-shadow p-[1.5rem] mb-[1rem]">
                    <div className="flex justify-between mb-[1rem]">
                        <span className="text-[#9C9DA4] text-[1.4rem] leading-[130%]">Сумма</span>
                        <span className="font-semibold text-[1.4rem] leading-[130%]">{data.amount}</span>
                    </div>
                    <div className="flex items-center justify-between w-full  ">
                        <p className="text-[1.4rem] leading-[130%] text-[var(--gray)]">Курс обмена</p>
                        <p className="text-[1.4rem] font-semibold leading-[130%] flex items-center gap-[0.4rem]">
                            <span className="flex items-center gap-[0.4rem]">
                                <UsdtIcon /> 1 USDT
                            </span>
                            <ArrowRightIcon />{" "}
                            <span className="flex items-center gap-[0.4rem]">
                                <RubleIcon /> 79.82 RUB
                            </span>{" "}
                        </p>
                    </div>
                </div>
                <div className="bg-white rounded-[1.5rem] box-shadow p-[1.5rem] mb-[2rem]">
                    <div className="flex justify-between">
                        <span className="text-[#9C9DA4] text-[1.4rem] leading-[130%]">ID транзакции</span>
                        <span className="font-semibold text-[1.4rem] leading-[130%] flex items-center gap-[0.5rem]">
                            <span className="max-w-[14.4rem] truncate">{data.id}</span>
                            <button onClick={() => handleCopy(data.id, "ID скопировано")}>
                                <CopyIcon />
                            </button>
                        </span>
                    </div>
                </div>
                <Button className="w-full mb-[1rem]" onClick={() => router.push("/")}>
                    На главную
                </Button>
                <Button className="w-full" variant="ghost" onClick={() => router.push(`/history/${id}`)}>
                    Детали транзакции
                </Button>
            </div>
        </div>
    );
}
