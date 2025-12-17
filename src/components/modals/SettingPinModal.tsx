import React from 'react';
import Modal from '../Modal';
import ShieldIcon from '@/components/icons/shield.svg';
import { Button } from '../ui/Button';

interface SettingPinModalProps {
    showModal: boolean;
    onClose: () => void;
    onCreatePin?: () => void;
}

const SettingPinModal = ({ showModal, onClose, onCreatePin }: SettingPinModalProps) => {
    const handleCreatePin = () => {
        onClose();
        onCreatePin?.();
    };

    return (
        <Modal swipeToClose={false} closable open={showModal} onClose={onClose}>
            <div className="flex flex-col">
                <div className="flex items-center mx-auto justify-center mb-[1.6rem] bg-[var(--yellow-secondary)] rounded-full w-[8rem] h-[8rem]">
                    <div className="center rounded-full bg-[var(--yellow-secondary)] w-[5.9rem] h-[5.9rem]">
                        <ShieldIcon width={30} height={30} className="w-[3rem] h-[3.8rem]" />
                    </div>
                </div>
                <h2 className="fs-bold mb-[0.8rem] text-[var(--text-main)] text-center">
                    Защитите ваш
                    <br />
                    кошелёк PIN-кодом
                </h2>
                <p className="fs-regular text-[var(--text-main)] mb-[2.4rem] text-center max-w-[34rem] mx-auto">
                    Установите PIN-код, чтобы добавить&nbsp;дополнительный уровень защиты ваших средств.
                </p>
                <Button variant="yellow" className="mb-[1.2rem]" onClick={handleCreatePin}>
                    Придумать PIN-код
                </Button>
                <Button variant="ghost" onClick={onClose}>
                    Сделаю позже
                </Button>
            </div>
        </Modal>
    );
};

export default SettingPinModal;
