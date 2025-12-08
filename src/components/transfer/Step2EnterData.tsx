"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import { Button } from "../ui/Button";
import Exclamation from "@/components/icons/exclamation-yellow.svg";
import OpenCamera from "@/components/icons/open-camera.svg";
import Image from "next/image";
import Plus from "@/components/icons/plus.svg";
import RefilledModal from "@/components/refilled/RefilledModal";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getRatesQuoteRub } from "@/lib/redux/selectors/rateSelectors";
import { getTransferAmount, getTransferAdress } from "@/lib/redux/selectors/transferSelectors";
import { setTransferAmount, setTransferAddress } from "@/lib/redux/slices/transferSlice";
import { setTransferCrypto, setTransferNetwork } from "@/lib/redux/slices/transferSlice";

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
    const rate = useAppSelector(getRatesQuoteRub);
    const convertedBalance = balance_usdt && rate ? Number((balance_usdt * rate).toFixed(2)) : 0;
    const selected = cryptos.find((crypto) => crypto.id === selectedCrypto);
    const dispatch = useAppDispatch();
    const address = useAppSelector(getTransferAdress);
    const amount = useAppSelector(getTransferAmount);
    const [isTopUpOpen, setTopUpOpen] = useState(false);
    const isLowBalance = balance_usdt !== undefined && balance_usdt < 1;
    const [addressError, setAddressError] = useState("");
    const [amountError, setAmountError] = useState("");

    const handleClick = () => {
        dispatch(setTransferAmount(balance_usdt ? balance_usdt.toFixed(2) : ""));
    };

    const tronAddressRegex = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;
    const COMMISSION_USDT = 2.75;
    const availableBalance = (balance_usdt || 0) - COMMISSION_USDT;

    const validateForm = () => {
        let valid = true;

        if (!tronAddressRegex.test(address)) {
            setAddressError("Некорректный адрес TRC20");
            valid = false;
        } else {
            setAddressError("");
        }

        const numericAmount = Number(amount);
        if (!numericAmount || numericAmount <= 0) {
            setAmountError("Введите сумму");
            valid = false;
        } else if (numericAmount > availableBalance || availableBalance < 0) {
            setAmountError("На балансе недостаточно средств");
            valid = false;
        } else {
            setAmountError("");
        }

        return valid;
    };

    return (
        <div className="flex flex-col justify-between min-h-[80dvh] gap-[1rem] mx-[1.6rem]">
            <RefilledModal isTopUpOpen={isTopUpOpen} setTopUpOpen={setTopUpOpen} />

            <div className="flex flex-col gap-[1.5rem]">
                <div>
                    <p className="fs-small mb-[1rem]">Адрес</p>
                    <Input
                        placeholder={`Адрес в сети ${selectedNetwork}`}
                        value={address}
                        onChange={(e) => {
                            dispatch(setTransferAddress(e.target.value));
                            setAddressError("");
                        }}
                        error={addressError}
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
                            onChange={(e) => {
                                const value = e.target.value.replace(',', '.');
                                dispatch(setTransferAmount(value));
                                setAmountError("");
                            }}
                            pattern="[0-9]*[.,]?[0-9]*"
                            inputMode="decimal"
                            error={amountError}
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
                <div className="mt-[1rem]">
                    <p className="text-[var(--text-secondary)] fs-small">Баланс</p>
                    <div className="bg-[var(--bg-secondary)] rounded-[2rem] mt-[1rem] px-[1.6rem]">
                        <div className="flex items-center w-full gap-[1rem]  py-[1.6rem]  box-shadow transition ">
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
                        {isLowBalance && (
                            <div className="flex py-[1rem] gap-[0.8rem] border-separator items-start">
                                <Exclamation
                                    alt="exclamation mark icon"
                                    width={20}
                                    height={20}
                                    className="w-[3rem] h-[3rem] rounded-full"
                                />
                                <p className="fs-very-small p-[0.7rem] text-[var(--yellow)]">
                                    На балансе недостаточно средств. Минимальная сумма перевода — 1
                                    USDT.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {!isLowBalance && (
                <Button
                    variant="yellow"
                    fullWidth={true}
                    onClick={() => {
                        if (validateForm()) {
                            dispatch(setTransferCrypto(selectedCrypto));
                            dispatch(setTransferNetwork(selectedNetwork));
                            handleNextStep();
                        }
                    }}
                >
                    Продолжить
                </Button>
            )}
            {isLowBalance && (
                <Button
                    variant="yellow"
                    fullWidth={true}
                    onClick={() => {
                        setTopUpOpen(true);
                    }}
                    className="flex justify-center items-center gap-[1rem]"
                >
                    <Plus
                        alt="plus icon"
                        width={25}
                        height={25}
                        className="w-[2.5rem] h-[2.5rem]"
                    />
                    Пополнить кошелёк
                </Button>
            )}
        </div>
    );
};

export default Step2EnterData;
