'use client';
import Loader from '@/components/ui/Loader';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { getLoading, getUser } from '@/lib/redux/selectors/userSelectors';
import { getHasPin, getPinChangeFlow } from '@/lib/redux/selectors/appSelectors';
import { clearPin, setPinChangeFlow } from '@/lib/redux/slices/appSlice';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ArrowRightIcon from '@/components/icons/right-arrow.svg';
import QuestionIcon from '@/components/icons/message-question.svg';
import PhoneScreenIcon from '@/components/icons/phone-screen.svg';
import KeyIcon from '@/components/icons/key.svg';
// import FaceIdIcon from '@/components/icons/face-id.svg';
import PinCodeScreen from '@/components/pin/PinCodeScreen';
import { Switch } from '@/components/ui/Switch';
import AddToHome from '@/components/AddToHome';
import { useMixpanel } from '@/lib/providers/MixpanelProvider';
const Page = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);
    const loadingApp = useAppSelector(getLoading);
    const hasPin = useAppSelector(getHasPin);
    const pinChangeFlow = useAppSelector(getPinChangeFlow);
    const { trackEvent } = useMixpanel();
    const [isOpen, setIsOpen] = useState(false);
    const [showPinSetup, setShowPinSetup] = useState(false);
    const [showPinAuth, setShowPinAuth] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeletingPin, setIsDeletingPin] = useState(false);

    // Событие при открытии страницы
    useEffect(() => {
        trackEvent('profile_page_opened');
    }, [trackEvent]);

    // Логика для изменения PIN (сначала auth, потом setup)
    useEffect(() => {
        if (pinChangeFlow && !showPinAuth && !showPinSetup) {
            setShowPinAuth(true);
            setIsDeletingPin(false);
        }
    }, [pinChangeFlow, showPinAuth, showPinSetup]);

    const handlePinAuthSuccess = () => {
        setShowPinAuth(false);
        if (isDeletingPin) {
            // Если это удаление, показываем модалку подтверждения
            setShowDeleteConfirm(true);
            setIsDeletingPin(false);
        } else {
            // Если это изменение, показываем экран создания нового PIN
            setShowPinSetup(true);
        }
    };

    const handlePinSetupSuccess = () => {
        setShowPinSetup(false);
        dispatch(setPinChangeFlow(false));
    };

    const handlePinSetupCancel = () => {
        setShowPinSetup(false);
        dispatch(setPinChangeFlow(false));
    };

    const handleTogglePin = (checked: boolean) => {
        if (checked) {
            // Если переключаем в ON (PIN не установлен), открываем экран создания
            setShowPinSetup(true);
        } else {
            // Если переключаем в OFF (PIN установлен), сначала требуем авторизацию PIN
            setIsDeletingPin(true);
            setShowPinAuth(true);
        }
    };

    const handleDeletePin = () => {
        dispatch(clearPin());
        setShowDeleteConfirm(false);
    };

    const handleChangePin = () => {
        dispatch(setPinChangeFlow(true));
    };

    if (loadingApp) {
        return <Loader className="h-[100dvh]" />;
    }

    return (
        <div className="px-[1.6rem] py-[2rem] w-full bg-[var(--bg-optional)] min-h-[100dvh] flex flex-col pb-[calc(var(--safe-bottom)+1.6rem)]">
            <div className="flex items-center gap-[1.5rem] bg-[var(--bg-secondary)] rounded-[2rem] p-[1.6rem] mb-[2.4rem]">
                <Image
                    className="rounded-full w-[5rem] h-[5rem]"
                    src={user?.data?.photo_url || ''}
                    alt={user?.data?.first_name || ''}
                    width={50}
                    height={50}
                />
                <p className="text-[2rem] leading-[130%] font-medium text-[var(--text-secondary)]">
                    {user?.data?.first_name || ''} {user?.data?.last_name || ''}
                </p>
            </div>
            {/* <div className="flex items-center gap-[1.5rem] bg-[var(--bg-secondary)] rounded-[2rem] p-[1.6rem] mb-[4rem]">
                <div className="w-[3.5rem] h-[3.5rem] bg-[var(--dark-gray-secondary)] rounded-[1rem] center">
                    <ApprovedIcon width={20} height={20} className="w-[2rem] h-[2rem]" />
                </div>
                <div className="flex flex-col gap-[0.5rem]">
                    <p className="text-[1.5rem] leading-[130%] font-medium text-[var(--text-main)]">KYC верификация</p>
                    <Link
                        href="/profile/kyc"
                        className="text-[1.4rem] flex items-center gap-[0.5rem] leading-[130%]  text-[var(--yellow)]"
                    >
                        Пройти <ArrowRightIcon width={12} height={12} className="w-[1.2rem] h-[1.2rem]" />
                    </Link>
                </div>
            </div> */}
            <div className="flex items-center gap-[1.5rem] bg-[var(--bg-secondary)] rounded-[2rem] p-[1.6rem] mb-[2.4rem]">
                <div className="w-[3.5rem] h-[3.5rem] bg-[var(--dark-gray-secondary)] rounded-[1rem] center">
                    <PhoneScreenIcon width={20} height={20} className="w-[2rem] h-[2rem]" />
                </div>
                <div className="flex flex-col gap-[0.5rem]">
                    <p className="text-[1.5rem] leading-[130%] font-medium text-[var(--text-main)]">
                        Иконка на экране «Домой»
                    </p>
                    <button
                        className="text-[1.4rem] w-fit cursor-pointer flex items-center gap-[0.5rem] leading-[130%]  text-[var(--yellow)]"
                        onClick={() => {
                            trackEvent('profile_add_to_home_clicked');
                            setIsOpen(true);
                        }}
                    >
                        Добавить <ArrowRightIcon width={12} height={12} className="w-[1.2rem] h-[1.2rem]" />
                    </button>
                </div>
            </div>
            {/* PIN-код секция */}
            <div className="mb-[2.4rem]">
                <p className="text-[1.4rem] leading-[130%] font-medium text-[var(--text-secondary)] mb-[0.8rem]">
                    Вход в приложение
                </p>
                <div className="flex flex-col gap-[1.5rem] bg-[var(--bg-secondary)] rounded-[2rem] p-[1.6rem] ">
                    <div className="flex items-center">
                        <div
                            className={`w-[3.5rem] h-[3.5rem] mr-[1rem] rounded-[1rem] center ${
                                hasPin ? 'bg-[var(--yellow-secondary)]' : 'bg-[var(--dark-gray-secondary)]'
                            }`}
                        >
                            <KeyIcon width={20} height={20} className="w-[2rem] h-[2rem]" />
                        </div>
                        <div className="flex-1 flex flex-col gap-[0.5rem]">
                            <p className="text-[1.5rem] leading-[130%] font-medium text-[var(--text-main)]">PIN-код</p>
                        </div>
                        <Switch
                            checked={hasPin}
                            onChange={handleTogglePin}
                            ariaLabel={hasPin ? 'Выключить PIN-код' : 'Включить PIN-код'}
                        />
                    </div>
                    {/* <div className="flex items-center">
                        <div
                            className={`w-[3.5rem] h-[3.5rem] mr-[1rem] rounded-[1rem] center ${
                                hasPin ? 'bg-[var(--yellow-secondary)]' : 'bg-[var(--dark-gray-secondary)]'
                            }`}
                        >
                            <FaceIdIcon width={20} height={20} className="w-[2rem] h-[2rem]" />
                        </div>
                        <div className="flex-1 flex flex-col gap-[0.5rem]">
                            <p className="text-[1.5rem] leading-[130%] font-medium text-[var(--text-main)]">Face ID</p>
                        </div>
                        <Switch checked={false} onChange={handleTogglePin} disabled />
                    </div> */}
                </div>
            </div>

            <div className="mb-[3.2rem]">
                <p className="text-[1.4rem] leading-[130%] font-medium text-[var(--text-secondary)] mb-[0.8rem]">
                    О нас
                </p>
                <Link
                    href="/faq"
                    className="flex items-center gap-[1rem] bg-[var(--bg-secondary)] rounded-[2rem] p-[1.6rem] "
                    onClick={() => trackEvent('profile_faq_clicked')}
                >
                    <div className="w-[3.5rem] h-[3.5rem] bg-[var(--yellow-secondary)] text-[var(--yellow)] rounded-[1rem] center">
                        <QuestionIcon width={20} height={20} className="w-[2rem] h-[2rem]" />
                    </div>
                    <p className="text-[1.5rem] leading-[130%] font-medium text-[var(--text-main)]">
                        Часто задаваемые вопросы
                    </p>
                    <span className="ml-auto text-[var(--text-secondary)]">
                        <ArrowRightIcon width={16} height={16} className="w-[1.6rem] h-[1.6rem]" />
                    </span>
                </Link>
            </div>
            <p className="text-[1.4rem] leading-[130%]  text-[var(--text-secondary)] text-center">v0.10.12</p>
            <AddToHome isOpen={isOpen} setIsOpen={setIsOpen} />

            {/* Экран авторизации PIN для изменения или удаления */}
            {showPinAuth && (
                <PinCodeScreen
                    mode="auth"
                    onCancel={() => {
                        setShowPinAuth(false);
                        dispatch(setPinChangeFlow(false));
                        setIsDeletingPin(false);
                    }}
                    onSuccess={handlePinAuthSuccess}
                    title={isDeletingPin ? 'Текущий PIN-код' : undefined}
                />
            )}

            {/* Экран создания/изменения PIN */}
            {showPinSetup && (
                <PinCodeScreen mode="setup" onCancel={handlePinSetupCancel} onSuccess={handlePinSetupSuccess} />
            )}

            {/* Модалка подтверждения удаления PIN */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[1100] bg-black/70 flex items-center justify-center px-[1.6rem]">
                    <div className="bg-[var(--bg-optional)] rounded-[2rem] p-[2.4rem] w-full max-w-[40rem]">
                        <h2 className="text-[2rem] font-medium text-[var(--text-main)] mb-[1.6rem] text-center">
                            Удалить PIN-код?
                        </h2>
                        <p className="text-[1.5rem] leading-[130%] text-[var(--text-secondary)] mb-[2.4rem] text-center">
                            После удаления PIN-кода защита кошелька будет отключена
                        </p>
                        <div className="flex flex-col gap-[1.2rem]">
                            <button
                                onClick={handleDeletePin}
                                className="w-full bg-[var(--red)] text-white rounded-[1.6rem] p-[1.6rem] text-[1.6rem] font-medium"
                            >
                                Удалить
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="w-full bg-[var(--bg-secondary)] text-[var(--text-main)] rounded-[1.6rem] p-[1.6rem] text-[1.6rem] font-medium"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;
