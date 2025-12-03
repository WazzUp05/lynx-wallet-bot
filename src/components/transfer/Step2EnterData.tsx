"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import { Button } from "../ui/Button";
import Exclamation from "@/components/icons/exclamation.svg";
import OpenCamera from "@/components/icons/open-camera.svg";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getRatesQuoteRub } from "@/lib/redux/selectors/rateSelectors";
import { getTransferAmount, getTransferAdress } from "@/lib/redux/selectors/transferSelectors";
import { setTransferAmount, setTransferAddress } from "@/lib/redux/slices/transferSlice";

type Step2Props = {
    selectedNetwork: string;
    selectedCrypto: string;
    handleNextStep: () => void;
    balance_usdt: number | undefined;
    cryptos: {
        id: string;
        label: string;
        description: string;
        iconUrl: string;
    }[];
};

const Step2EnterData: React.FC<Step2Props> = ({
    selectedNetwork,
    selectedCrypto,
    handleNextStep,
    cryptos,
    balance_usdt,
}) => {
    // const [amount, setAmount] = useState("");
    const rate = useAppSelector(getRatesQuoteRub);
    const convertedBalance = balance_usdt && rate ? Number((balance_usdt * rate).toFixed(2)) : 0;
    const selected = cryptos.find((crypto) => crypto.id === selectedCrypto);
    const dispatch = useAppDispatch();
    const address = useAppSelector(getTransferAdress);
    const amount = useAppSelector(getTransferAmount);
    const transferAmount = useAppSelector(getTransferAmount);

    const handleClick = () => {
        dispatch(setTransferAmount(balance_usdt ? balance_usdt.toString() : ""));
    };

    return (
        <div className="flex flex-col justify-between min-h-[80dvh]">
            <div className="flex flex-col gap-[2rem]">
                <div>
                    <p className="fs-small mb-[1rem]">Адрес</p>
                    <Input
                        placeholder={`Адрес в сети ${selectedNetwork}`}
                        value={address}
                        onChange={(e) => dispatch(setTransferAddress(e.target.value))}
                    >
                        <button>
                            <OpenCamera
                                alt="open camera icon"
                                width={20}
                                height={20}
                                className="w-[2rem] h-[2rem]"
                            />
                        </button>
                    </Input>
                </div>
                <div>
                    <div>
                        <p className="fs-small mb-[1rem]">Сумма</p>
                        <Input
                            placeholder={`0,00 ${selectedCrypto}`}
                            disabledClipboardCheck={true}
                            value={amount}
                            onChange={(e) => dispatch(setTransferAmount(e.target.value))}
                        >
                            <button
                                className="flex items-center gap-[0.8rem] px-[1.2rem] py-[0.8rem] rounded-[0.8rem] bg-transparent hover:bg-[var(--bg-hover)] transition-colors duration-200 text-[#FFD700] text-[1.4rem]"
                                onClick={handleClick}
                            >
                                Всё
                            </button>
                        </Input>
                    </div>
                    <div className="flex bg-[var(--yellow-optional)] rounded-[1rem] p-[1rem] gap-[0.8rem] mt-[1rem] items-center">
                        <Exclamation
                            alt="exclamation mark icon"
                            width={20}
                            height={20}
                            className="w-[2rem] h-[2rem] rounded-full"
                        />
                        <p className="fs-very-small p-[0.7rem]">
                            Сейчас доступны переводы только внутри Lynx
                        </p>
                    </div>
                </div>
                <div className="">
                    <p className="text-[var(--text-secondary)] fs-small">Баланс</p>
                    <div className="flex items-center w-full gap-[1rem]  p-[1.6rem] rounded-[2rem] box-shadow transition bg-[var(--bg-secondary)]">
                        <Image
                            src={selected?.iconUrl || ""}
                            alt={selected?.label || ""}
                            width={40}
                            height={40}
                            className="w-[4rem] h-[4rem] rounded-full "
                        />
                        <div>
                            <p className="fs-regular-bold">{`${balance_usdt ? balance_usdt : "Загрузка..."} ${balance_usdt ? selectedCrypto : ""}`}</p>
                            <p className="text-[var(--text-secondary)] fs-small">{`${balance_usdt ? convertedBalance : "..."} ₽`}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Button
                variant="yellow"
                fullWidth={true}
                onClick={() => {
                    handleNextStep();
                }}
            >
                Продолжить
            </Button>
        </div>
    );
};

export default Step2EnterData;
