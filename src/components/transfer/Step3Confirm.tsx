"use client";
import Image from "next/image";

import { useAppSelector } from "@/lib/redux/hooks";
import { getTransferAmount, getTransferAdress } from "@/lib/redux/selectors/transferSelectors";
import Copy from "@/components/icons/copy-white.svg";
import { Button } from "../ui/Button";


type Step3ConfirmProps = {
    selectedNetwork: string;
    selectedCrypto: string;
    handleNextStep: () => void;
    cryptos: {
        id: string;
        label: string;
        description: string;
        iconUrl: string;
    }[];
};

const Step3Confirm: React.FC<Step3ConfirmProps> = ({
    selectedCrypto,
    selectedNetwork,
    cryptos,
    handleNextStep,
}) => {
    const selected = cryptos.find((crypto) => crypto.id === selectedCrypto);
    const amount = useAppSelector(getTransferAmount);
    const address = useAppSelector(getTransferAdress);
    const addressSliced = `${address.slice(0, 7)}...${address.slice(-8)}`;

    return (
        <div className="flex flex-col gap-[2rem] max-h-[100dvh]">
            <div className="flex flex-col gap-[1rem] items-center py-[1rem] w-full">
                <Image
                    src={selected?.iconUrl || ""}
                    alt={selected?.label || ""}
                    width={40}
                    height={40}
                    className="w-[6rem] h-[6rem] rounded-full self-center"
                />
                <p className="fs-regular-bold text-[var(--text-main)] self-center">
                    {amount} {selectedCrypto}
                </p>
            </div>
            <div className="flex flex-col gap-[1.6rem]">
                <div className="flex flex-col bg-[var(--bg-secondary)] rounded-[1rem] p-[1.6rem] gap-[1.6rem]">
                    <div className="flex justify-between items-center">
                        <p className="text-[var(--text-secondary)] fs-small">Будет отправлено</p>
                        <p className="fs-regular text-[var(--text-main)]">
                            {amount} {selectedCrypto}
                        </p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-[var(--text-secondary)] fs-small">Комиссия</p>
                        <p className="fs-regular text-[var(--text-main)]">
                            {selectedCrypto === "USDT" ? "2.75 USDT" : "0.2 TON"}
                        </p>
                    </div>
                </div>
                <div className=" bg-[var(--bg-secondary)] rounded-[1rem] p-[1.6rem] flex justify-between items-center">
                    <p className="text-[var(--text-secondary)] fs-small">Сеть</p>
                    <p className="fs-regular text-[var(--text-main)]">{selectedNetwork}</p>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-[1rem] p-[1.6rem] flex justify-between items-center">
                    <p className="text-[var(--text-secondary)] fs-small">Получатель</p>
                    <div className="flex gap-[0.8rem]">
                        <p className="fs-regular text-[var(--text-main)]">{addressSliced}</p>
                        <button 
                            type="button" 
                            onClick={() => {}}
                            className="center"
                        >
                            <Copy />
                        </button>
                    </div>
                    
                </div>
            </div>
            <div>
                <p className="text-[var(--text-secondary)] fs-very-small">
                    Убедитесь, что адрес получателя принадлежит сети TRC20, иначе ваши средства
                    могут быть безвозвратно утеряны.
                </p>
            </div>
            <Button
                variant="yellow"
                fullWidth={true}
                onClick={() => {
                    handleNextStep();
                }}
            >
                Подтвердить перевод
            </Button>
        </div>
    );
};

export default Step3Confirm;
