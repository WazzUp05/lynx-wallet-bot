import Modal from "@/components/Modal";
import Arrow from "@/components/icons/arrow-top-right.svg";
import ExclamationOrange from "@/components/icons/exclamation-orange.svg";
import ExclamationYellow from "@/components/icons/exclamation-yellow.svg";
import CheckGreen from "@/components/icons/check-green.svg";
import CopyButton from "@/components/ui/CopyButton";
import { getTransferAdress } from "@/lib/redux/selectors/transferSelectors";
import { useAppSelector } from "@/lib/redux/hooks";
import { useMemo } from "react";

const COMMISSION = 2.75;

interface DetailsProps {
    isOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    amount: string;
    crypto: string;
    isSuccess: boolean;
    date: string;
    transactionId: string;
}

const Details: React.FC<DetailsProps> = ({
    isOpen,
    setIsModalOpen,
    amount,
    crypto,
    isSuccess,
    date,
    transactionId,
}) => {
    const address = useAppSelector(getTransferAdress);
    const addressSliced =  `${address.slice(0, 7)}...${address.slice(-8)}`;
    const transactionIdSliced = transactionId 
    ? transactionId.slice(0, 14) + "..." 
    : "N/A";

    return (
        <Modal
            closable={true}
            swipeToClose={false}
            open={isOpen}
            onClose={() => setIsModalOpen(false)}
            title="Детали транзакции"
        >
            {isSuccess && (
                <div className="flex flex-col gap-[2rem] w-full">
                    <div className="flex flex-col items-center gap-[1rem] grow ">
                        <div className="rounded-full bg-[var(--yellow-secondary)] center w-[6rem] h-[6rem] ">
                            <Arrow width={30} height={30} className="w-[3rem] h-[3rem]" />
                        </div>
                        <p className="fs-regular-bold text-[var(--text-main)]">
                            -{amount} {crypto}
                        </p>
                        <div className="flex gap-[1rem] items-center bg-[var(--dark-gray-main)] rounded-[2rem] p-[0.8rem]">
                            <CheckGreen
                                width={20}
                                height={20}
                                className="w-[2rem] h-[2rem] inline-block"
                            />
                            <p className="fs-very-small-bold">Успешно</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-[1.6rem] bg-[var(--bg-secondary)] rounded-[2rem] p-[1.6rem] ">
                        <div className="flex justify-between">
                            <p className="text-[var(--text-secondary)] fs-small">Отправлено</p>
                            <p className="fs-regular-bold text-[var(--text-main)]">
                                -{amount} {crypto}
                            </p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-[var(--text-secondary)] fs-small">Комиссия</p>
                            <p className="fs-small text-[var(--text-main)]">
                                {COMMISSION} {crypto}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[1.6rem] bg-[var(--bg-secondary)] rounded-[2rem] p-[1.6rem]">
                        <div className="flex justify-between">
                            <p className="text-[var(--text-secondary)] fs-small">Дата и время</p>
                            <p className="fs-small text-[var(--text-main)]">{date}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-[var(--text-secondary)] fs-small">ID транзакции</p>
                            <div className="flex gap-[0.8rem]">
                                <p className="fs-small text-[var(--text-main)]">
                                    {transactionIdSliced}...
                                </p>
                                <CopyButton text={transactionId} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[1.6rem] bg-[var(--bg-secondary)] rounded-[2rem] p-[1.6rem]">
                        <div className="flex justify-between">
                            <p className="text-[var(--text-secondary)] fs-small">Получатель</p>
                            <div className="flex gap-[0.8rem]">
                                <p className="fs-small text-[var(--text-main)]">{addressSliced}</p>
                                <CopyButton text={address} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {!isSuccess && (
                <div className="flex flex-col gap-[2rem] ">
                    <div className="flex flex-col items-center gap-[1rem] grow ">
                        <div className="rounded-full bg-[var(--yellow-secondary)] center w-[6rem] h-[6rem] ">
                            <Arrow width={30} height={30} className="w-[3rem] h-[3rem]" />
                        </div>
                        <p className="fs-regular-bold text-[var(--text-main)]">
                            -{amount} {crypto}
                        </p>
                        <div className="flex gap-[1rem] items-center bg-[var(--dark-gray-main)] rounded-[2rem] p-[0.8rem]">
                            <ExclamationOrange
                                width={20}
                                height={20}
                                className="w-[2rem] h-[2rem] inline-block"
                            />
                            <p className="fs-very-small-bold">Отклонено</p>
                        </div>
                    </div>
                    <div className="flex py-[1rem] gap-[0.8rem] items-start bg-[var(--bg-secondary)] rounded-[2rem] p-[1.6rem] ">
                        <ExclamationYellow
                            alt="exclamation mark icon"
                            width={20}
                            height={20}
                            className="w-[3.5rem] h-[3.5rem] rounded-full"
                        />
                        <p className="fs-very-small p-[0.7rem] text-[var(--yellow)]">
                            Перевод отклонён системой безопасности. Попробуйте позже или обратитесь
                            в поддержку.
                        </p>
                    </div>
                    <div className="flex flex-col gap-[1rem] w-full">
                        <p className="text-[var(--text-secondary)] fs-small">Детали</p>
                        <div className="flex flex-col gap-[1.6rem] bg-[var(--bg-secondary)] rounded-[2rem] p-[1.6rem]">
                            <div className="flex justify-between">
                                <p className="text-[var(--text-secondary)] fs-small">
                                    Дата и время
                                </p>
                                <p className="fs-small text-[var(--text-main)]">{date}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-[var(--text-secondary)] fs-small">
                                    ID транзакции
                                </p>
                                <div className="flex gap-[0.8rem]">
                                    <p className="fs-small text-[var(--text-main)]">
                                        {transactionIdSliced}...
                                    </p>
                                    <CopyButton text={transactionId} />
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-[var(--text-secondary)] fs-small">Отправлено</p>
                                <p className="fs-regular-bold text-[var(--text-main)]">
                                    -{amount} {crypto}
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-[var(--text-secondary)] fs-small">Комиссия</p>
                                <p className="fs-small text-[var(--text-main)]">
                                    {COMMISSION} {crypto}
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-[var(--text-secondary)] fs-small">Получатель</p>
                                <div className="flex gap-[0.8rem]">
                                    <p className="fs-small text-[var(--text-main)]">
                                        {addressSliced}
                                    </p>
                                    <CopyButton text={address} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default Details;
