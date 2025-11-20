import React, { useState } from 'react';
import Modal from '../Modal';
import FaceIdIcon from '@/components/icons/face-id.svg';
import { Button } from '../ui/Button';
import Loader from '../ui/Loader';

interface BiometricOfferModalProps {
    showModal: boolean;
    onClose: () => void;
    onEnable: () => Promise<void>;
    biometricType?: 'face' | 'fingerprint' | 'unknown';
}

const BiometricOfferModal = ({ showModal, onClose, onEnable, biometricType = 'unknown' }: BiometricOfferModalProps) => {
    const [isRegistering, setIsRegistering] = useState(false);

    const handleEnable = async () => {
        setIsRegistering(true);
        try {
            await onEnable();
        } catch (error) {
            console.error('Ошибка при регистрации биометрии:', error);
        } finally {
            setIsRegistering(false);
        }
    };

    const getBiometricLabel = () => {
        switch (biometricType) {
            case 'face':
                return 'Face ID';
            case 'fingerprint':
                return 'отпечаток пальца';
            default:
                return 'биометрию';
        }
    };

    return (
        <Modal swipeToClose={false} closable open={showModal} onClose={onClose}>
            <div className="flex flex-col">
                <div className="flex items-center mx-auto justify-center mb-[1.6rem] bg-[var(--yellow-secondary)] rounded-full w-[8rem] h-[8rem]">
                    <div className="center rounded-full bg-[var(--yellow-secondary)] w-[5.9rem] h-[5.9rem]">
                        <FaceIdIcon width={30} height={30} className="w-[3rem] h-[3.8rem]" />
                    </div>
                </div>
                <h2 className="fs-bold mb-[0.8rem] text-[var(--text-main)] text-center">
                    Включить {getBiometricLabel()}?
                </h2>
                <p className="fs-regular text-[var(--text-main)] mb-[2.4rem] text-center">
                    Используйте {getBiometricLabel()} для быстрой разблокировки кошелька. PIN-код останется основным
                    способом защиты.
                </p>
                <Button
                    variant="yellow"
                    className="mb-[1.2rem]"
                    onClick={handleEnable}
                    disabled={isRegistering}
                >
                    {isRegistering ? (
                        <span className="flex items-center justify-center gap-[0.8rem]">
                            <Loader className="w-[1.6rem] h-[1.6rem]" />
                            Регистрация...
                        </span>
                    ) : (
                        `Включить ${getBiometricLabel()}`
                    )}
                </Button>
                <Button variant="ghost" onClick={onClose} disabled={isRegistering}>
                    Пропустить
                </Button>
            </div>
        </Modal>
    );
};

export default BiometricOfferModal;

