"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import ArrowLeft from "@/components/icons/arrow-left.svg";
import WarrningLeftIcon from "@/components/icons/warrning-mark.svg";
import RightIcon from "@/components/icons/right-arrow.svg";

import { useState } from "react";
import TaxModal from "@/components/modals/TaxModal";

// Типизация для адресов
type NetworkData = {
    address: string;
    fee: string;
    min: string;
    networkLabel: string;
    icon: string;
};
type Addresses = {
    [crypto: string]: {
        [network: string]: NetworkData;
    };
};

// Моковые данные для примера
const ADDRESSES: Addresses = {
    USDT: {
        TRC20: {
            address: "TPMMFQFEET1pjScYfr1LmYE91GVWGvtLDn9",
            fee: "2.75 USDT",
            min: "5 USDT",
            networkLabel: "TRC20",
            icon: "/icons/trc20.svg",
        },
        TON: {
            address: "UQ...TONADDRESS",
            fee: "2.75 USDT",
            min: "1 USDT",
            networkLabel: "TON",
            icon: "/icons/ton.svg",
        },
    },
    TON: {
        TON: {
            address: "UQ...TONADDRESS",
            fee: "0.2 TON",
            min: "1 TON",
            networkLabel: "TON",
            icon: "/icons/ton.svg",
        },
    },
};

export default function RefilledQrPage() {
    const params = useParams();
    const router = useRouter();
    const { crypto, network } = params as { crypto: string; network: string };
    const [showModal, setShowModal] = useState(false);

    const srcQr = network === "TRC20" ? "/qr-trc20.png" : network === "TON" ? "/qr-ton.png" : "/qr-demo.png";

    const upperCrypto = crypto?.toUpperCase();
    const upperNetwork = network?.toUpperCase();

    // Без any: используем типизацию Addresses
    const data: NetworkData | undefined =
        upperCrypto in ADDRESSES && upperNetwork in ADDRESSES[upperCrypto]
            ? ADDRESSES[upperCrypto][upperNetwork]
            : undefined;

    if (!data) return <div className="p-8">Данные не найдены</div>;

    return (
        <div
            className=" bg-[#f7f8fa] flex flex-col items-center px-[1.6rem] py-[2rem] "
            style={{
                paddingBottom: "calc(1rem + var(--nav-bottom-height))",
            }}
        >
            <div className="flex items-center justify-center relative text-[1.8rem] leading-[130%] mb-[3rem] font-semibold w-full">
                <button className="absolute left-0 top-1/2 -translate-y-1/2" onClick={() => router.back()}>
                    <ArrowLeft />
                </button>
                <span className="flex items-center gap-[0.5rem] ">
                    <Image src={data.icon} alt={data.networkLabel} width={24} height={24} />
                    Пополнение {crypto}
                </span>
            </div>
            <div className="bg-white rounded-[1.5rem] box-shadow py-[2rem] px-[1.6rem] w-full  flex flex-col items-center mb-[2rem]">
                {/* QR-код (можно заменить на компонент генерации QR) */}
                <div className="mb-[2rem]">
                    <Image src={srcQr} alt="QR" width={180} height={180} />
                </div>
                <p className="mb-[0.5rem] text-[var(--gray)] fs-very-small">
                    Ваш адрес <span className="uppercase">{crypto}</span> в сети {data.networkLabel}
                </p>
                <div className="text-[1.4rem] leading-[130%] font-semibold break-all text-center mb-[0.5rem]">
                    {data.address}
                </div>
                <div className="text-[1.2rem] leading-[130%] text-[var(--gray)] text-center mb-[1rem]">
                    Данный адрес предназначен только для получения {crypto} в сети {data.networkLabel}. Отправка активов
                    в других сетях приведёт к их безвозвратной потере!
                </div>
                <div className="w-full flex gap-[0.5rem] bg-[#FFF4E8]  py-[1rem] px-[1.6rem] rounded-[1.5rem] mb-2 text-[1.2rem] leading-[130%] ">
                    <div>
                        <WarrningLeftIcon />
                    </div>
                    <span>
                        Для зачисления средств на ваш счёт необходимо выполнить перевод(ы) на сумму больше{" "}
                        <b>{data.min}</b>
                    </span>
                </div>
                <div
                    onClick={() => setShowModal(true)}
                    className="w-full bg-[#FFF4E8]  py-[1rem] px-[1.6rem] rounded-[1.5rem] text-[1.2rem] leading-[130%]  flex items-center gap-2"
                >
                    <div>
                        <WarrningLeftIcon />
                    </div>
                    <span>
                        Фиксированная комиссия <b>{data.fee}</b>
                    </span>
                    <div className="text-[#FF9720] ml-auto">
                        <RightIcon className="" />
                    </div>
                </div>
            </div>
            <Button className="w-full mb-[1rem]" onClick={() => navigator.clipboard.writeText(data.address)}>
                Копировать адрес
            </Button>
            <Button className="w-full" variant="ghost" onClick={() => router.push("/")}>
                Вернуться на главную
            </Button>
            <TaxModal showModal={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
}
