'use client';

import { useCallback, useMemo, useState } from 'react';
import CloseIcon from '@/components/icons/close.svg';
import BackspaceIcon from '@/components/icons/back.svg';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getPinHash, getPinSalt } from '@/lib/redux/selectors/appSelectors';
import { setPinAuthRequired, setPinData } from '@/lib/redux/slices/appSlice';
import { PIN_LENGTH, generatePinSalt, hashPin } from '@/lib/utils/pin';
import { Toast } from '../ui/Toast';

type PinCodeScreenProps = {
    mode: 'setup' | 'auth';
    onCancel?: () => void;
    onSuccess?: () => void;
    title?: string;
};

const baseDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'];

const PinCodeScreen = ({ mode, onCancel, onSuccess, title }: PinCodeScreenProps) => {
    const dispatch = useAppDispatch();
    const pinHash = useAppSelector(getPinHash);
    const pinSalt = useAppSelector(getPinSalt);

    const [pinInput, setPinInput] = useState('');
    const [firstPin, setFirstPin] = useState('');
    const [step, setStep] = useState<'enter' | 'confirm'>('enter');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [shake, setShake] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);

    const currentTitle = useMemo(() => {
        if (title) return title;
        if (mode === 'auth') return 'Введите PIN-код';
        return step === 'confirm' ? 'Подтвердите PIN-код' : 'Добавьте PIN-код';
    }, [mode, step, title]);

    const triggerError = useCallback(
        (message: string) => {
            setToastOpen(true);
            setError(message);
            setShake(true);
            const timeout = setTimeout(() => setShake(false), 400);
            return () => clearTimeout(timeout);
        },
        [setToastOpen]
    );

    const closeToast = useCallback(() => {
        setToastOpen(false);
    }, [setToastOpen]);

    const resetState = useCallback(() => {
        setPinInput('');
        setFirstPin('');
        setStep('enter');
    }, []);

    const handleSuccess = useCallback(() => {
        onSuccess?.();
    }, [onSuccess]);

    const handleComplete = useCallback(
        async (value: string) => {
            if (mode === 'setup') {
                if (step === 'enter') {
                    setFirstPin(value);
                    setPinInput('');
                    setStep('confirm');
                    setError('');
                    return;
                }

                if (value !== firstPin) {
                    triggerError('PIN-коды не совпадают');
                    setPinInput('');
                    setFirstPin('');
                    setStep('enter');
                    return;
                }

                setIsProcessing(true);
                try {
                    const salt = generatePinSalt();
                    const hash = await hashPin(value, salt);
                    dispatch(setPinData({ hash, salt }));
                    setPinInput('');
                    setError('');
                    handleSuccess();
                } catch (e) {
                    console.error(e);
                    triggerError('Не удалось сохранить PIN');
                } finally {
                    setIsProcessing(false);
                }
                return;
            }

            if (!pinHash || !pinSalt) {
                triggerError('PIN не задан');
                return;
            }

            setIsProcessing(true);
            try {
                const hashedValue = await hashPin(value, pinSalt);
                if (hashedValue === pinHash) {
                    dispatch(setPinAuthRequired(false));
                    setPinInput('');
                    setError('');
                    handleSuccess();
                    return;
                }

                triggerError('Неверный PIN');
            } catch (e) {
                console.error(e);
                triggerError('Ошибка проверки PIN');
            } finally {
                setIsProcessing(false);
                setPinInput('');
            }
        },
        [dispatch, firstPin, handleSuccess, mode, pinHash, pinSalt, step, triggerError]
    );

    const handleDigitPress = (digit: string) => {
        if (isProcessing) return;
        if (pinInput.length >= PIN_LENGTH) return;
        const newValue = `${pinInput}${digit}`;
        setPinInput(newValue);
        if (newValue.length === PIN_LENGTH) {
            void handleComplete(newValue);
        }
    };

    const handleBackspace = () => {
        if (isProcessing) return;
        if (!pinInput.length) {
            if (mode === 'setup' && step === 'confirm') {
                setStep('enter');
                setFirstPin('');
            }
            return;
        }
        setPinInput((prev) => prev.slice(0, -1));
    };

    const handleClose = () => {
        if (mode === 'setup') {
            // В режиме установки просто закрываем компонент
            if (onCancel) {
                onCancel();
            }
            return;
        }

        // В режиме входа закрываем приложение
        if (typeof window !== 'undefined') {
            const telegramWebApp = (window as typeof window & { Telegram?: { WebApp?: { close?: () => void } } })
                .Telegram;
            telegramWebApp?.WebApp?.close?.();
        }
    };

    const renderDigitButton = (digit: string, index: number) => {
        if (!digit) {
            return <div key={`empty-${index}`} className="h-[7.6rem] w-[7.6rem]" />;
        }

        if (digit === 'backspace') {
            return (
                <button
                    key="backspace"
                    type="button"
                    aria-label="Удалить"
                    className="h-[7.6rem] w-[7.6rem] flex items-center justify-center rounded-full text-[var(--text-main)]  backdrop-blur-sm transition active:scale-95"
                    onClick={handleBackspace}
                >
                    <BackspaceIcon className="h-[4rem] w-[4rem] " />
                </button>
            );
        }

        return (
            <button
                key={digit}
                type="button"
                disabled={isProcessing}
                onClick={() => handleDigitPress(digit)}
                className="h-[7.6rem] w-[7.6rem] rounded-full bg-[var(--dark-gray-main)] text-[var(--text-main)] text-[3.4rem] leading-[4.1rem] backdrop-blur-sm transition active:scale-95 disabled:opacity-40 focus-visible:outline-none"
            >
                {digit}
            </button>
        );
    };

    return (
        <section className="fixed inset-0 z-[1100] flex min-h-dvh flex-col px-[1.6rem] pt-[2.6rem] bg-[var(--bg-optional)] text-white">
            <Toast open={toastOpen} message={error} type="error" onClose={closeToast} />
            <div className="flex items-center justify-end mb-[3.2rem]">
                <button
                    className="bg-[var(--bg-secondary)]  rounded-[1rem] w-[3.5rem] h-[3.5rem] center ml-auto text-[var(--text-secondary)]"
                    onClick={handleClose}
                    aria-label="Закрыть"
                >
                    <CloseIcon width={15} height={15} className="w-[1.5rem] h-[1.5rem]" />
                </button>
            </div>

            <div className="flex flex-1 flex-col items-center px-6">
                <div className="fs-bold mb-[3.2rem]">{currentTitle}</div>
                <div className="flex flex-col items-center mb-[3.2rem]">
                    <div className={`flex gap-[1.5rem] transition-transform ${shake ? 'animate-[shake_0.4s]' : ''}`}>
                        {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                            <span
                                key={index}
                                className={`h-[1.5rem] w-[1.5rem] rounded-full transition ${
                                    index < pinInput.length ? 'bg-[var(--yellow)]' : 'bg-[var(--text-main)]'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="mb-[1.5rem] grid grid-cols-3 place-items-center gap-[2.4rem]">
                    {baseDigits.map((digit, index) => renderDigitButton(digit, index))}
                </div>
                {mode === 'setup' && step === 'confirm' && (
                    <button
                        type="button"
                        onClick={resetState}
                        className="fs-small text-[var(--text-optional)] underline-offset-4 hover:underline"
                    >
                        Ввести заново
                    </button>
                )}
            </div>
        </section>
    );
};

export default PinCodeScreen;
