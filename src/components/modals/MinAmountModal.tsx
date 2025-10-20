import React from 'react';
import Modal from '../Modal';
import WalletIcon from '@/components/icons/wallet-color.svg';
import GuadrdIcon from '@/components/icons/guard.svg';

interface MinAmountModalProps {
    showModal: boolean;
    onClose: () => void;
}

const MinAmountModal = ({ showModal, onClose }: MinAmountModalProps) => {
    return (
        <Modal swipeToClose={false} closable open={showModal} onClose={onClose}>
            <div>
                <h2 className="text-[2.5rem] leading-[130%]  font-semibold mb-[2.5rem]">
                    Минимальная сумма для зачисления
                </h2>
                <div className="mb-[3rem]">
                    <div className="flex items-center gap-[1rem] mb-[1.5rem] ">
                        <WalletIcon width={20} height={24} className="w-[2rem] h-[2rem]" />
                        <p className="text-[1.4rem] leading-[130%] font-semibold">
                            Почему нужно перевести больше 5 USDT?
                        </p>
                    </div>
                    <ul className="mb-[1.5rem]">
                        <li className="flex items-start gap-[1rem] mb-[1.5rem] text-[1.2rem] leading-[130%]">
                            <span className="mt-[0.7rem] w-[0.7rem] h-[0.7rem] rounded-full bg-[var(--yellow)] flex-shrink-0" />
                            <span>Сеть TRC20 не обрабатывает зачисления на меньшие суммы.</span>
                        </li>
                        <li className="flex items-start gap-[1rem] mb-[1.5rem] text-[1.2rem] leading-[130%]">
                            <span className="mt-[0.7rem] w-[0.7rem] h-[0.7rem] rounded-full bg-[var(--yellow)] flex-shrink-0" />
                            <span>
                                Чтобы перевод был подтверждён и средства появились на балансе, общая сумма ваших
                                транзакций должна превышать <b>5 USDT</b>.
                            </span>
                        </li>
                        <li className="flex items-start gap-[1rem] mb-[1.5rem] text-[1.2rem] leading-[130%]">
                            <span className="mt-[0.7rem] w-[0.7rem] h-[0.7rem] rounded-full bg-[var(--yellow)] flex-shrink-0" />
                            <span>
                                Можно сделать один перевод больше <b>5 USDT</b> или несколько мелких, чтобы в сумме
                                получилось больше.
                            </span>
                        </li>
                    </ul>
                </div>

                <p className="text-[1.2rem] leading-[130%] text-[var(--text-secondary)]">
                    Это требование связано с ограничениями сети. Lynx Wallet не получает выгоды от этого правила.
                </p>
            </div>
        </Modal>
    );
};

export default MinAmountModal;
