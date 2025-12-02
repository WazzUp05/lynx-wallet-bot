import React from "react";
import Modal from "../Modal";
import ProcentIcon from "@/components/icons/procent.svg";
import GuadrdIcon from "@/components/icons/guard.svg";

interface TaxModalProps {
    showModal: boolean;
    onClose: () => void;
}

const TaxModal = ({ showModal, onClose }: TaxModalProps) => {
    return (
        <Modal closable swipeToClose={false} open={showModal} onClose={onClose}>
            <div>
                <p className="mb-[1.2rem] text-[var(--bg-main)] w-fit text-[1.6rem] leading-[130%] font-semibold py-[0.4rem] px-[0.8rem] rounded-[0.7rem] bg-[var(--yellow)]">
                    2.5 + 0.25 =
                </p>
                <h2 className="text-[2.5rem] leading-[130%]  font-semibold mb-[2.4rem]">
                    Удобство + Безопасность
                </h2>
                <div className="mb-[3rem] text-[1.4rem] leading-[130%]">
                    <p className="flex items-center gap-[1rem] mb-[1.6rem]  font-semibold">
                        <ProcentIcon width={20} height={20} /> Удобство
                    </p>
                    <p className=" font-semibold mb-[0.8rem]">Почему мы берём комиссию 2.5$?</p>
                    <p className="text-[1.2rem] leading-[130%] text-[var(--text-main)]">
                        Сеть Tron взимает комиссию за перевод USDT (14 TRX ≈ 2.5$). Вам не нужно
                        пополнять баланс TRX — мы сами оплачиваем эту комиссию, делая использование
                        кошелька простым и удобным.
                    </p>
                </div>
                <div className="mb-[2.4rem] text-[1.4rem] leading-[130%]">
                    <p className="flex items-center gap-[1rem] mb-[1.6rem]  font-semibold">
                        <GuadrdIcon width={20} height={20} /> Безопасность
                    </p>
                    <p className=" font-semibold mb-[0.8rem]">Зачем дополнительно 0.25$?</p>
                    <p className="text-[1.2rem] leading-[130%] text-[var(--text-main)]">
                        Эти средства покрывают себестоимость AML-проверки, которая гарантирует
                        безопасность.
                    </p>
                </div>
                <p className="text-[1.2rem] leading-[130%] text-[var(--text-secondary)]">
                    Lynx Wallet получает 0% прибыли за этот перевод (в последующих релизах
                    запланировано снижение комиссии для наших пользователей за счёт оптимизации
                    работы с Tron).
                </p>
            </div>
        </Modal>
    );
};

export default TaxModal;
