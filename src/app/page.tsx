'use client';
import Main from '@/components/main/Main';
import Onboarding from '@/components/onboarding/Onboarding';
import Loader from '@/components/ui/Loader';
import PinCodeScreen from '@/components/pin/PinCodeScreen';
import SettingPinModal from '@/components/modals/SettingPinModal';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import {
    getHasPin,
    getOnboardingCompleted,
    getWaitingForDeposit,
    getShowPinOfferModal,
} from '@/lib/redux/selectors/appSelectors';
import { getHistory } from '@/lib/redux/selectors/historySelectors';
import { getWallet } from '@/lib/redux/selectors/userSelectors';
import {
    setIsFirstTime,
    setNeedDeposit,
    setWaitingForDeposit,
    setOnboardingCompleted,
    setOnboardingStep,
    setShowPinOfferModal,
} from '@/lib/redux/slices/appSlice';
import { fetchHistory } from '@/lib/redux/thunks/historyThunks';
import { useEffect, useState } from 'react';
import { getLoading, getUser } from '@/lib/redux/selectors/userSelectors';

export default function Home() {
    const dispatch = useAppDispatch();
    const onboardingCompleted = useAppSelector(getOnboardingCompleted);
    const isWaitingForDeposit = useAppSelector(getWaitingForDeposit);
    const hasPin = useAppSelector(getHasPin);
    const showPinOfferModal = useAppSelector(getShowPinOfferModal);

    const history = useAppSelector(getHistory);
    const wallet = useAppSelector(getWallet);
    const loadingApp = useAppSelector(getLoading);
    const user = useAppSelector(getUser);

    const [showPinSetup, setShowPinSetup] = useState(false);

    // Проверяем, первый ли раз зашел пользователь
    useEffect(() => {
        if (user && wallet && history !== undefined) {
            const hasBalance = wallet.balance_usdt > 0;
            const hasHistory = history.length > 0;

            if (!hasBalance && !hasHistory) {
                // Первый раз - показываем онбординг
                dispatch(setIsFirstTime(true));
            } else {
                // Не первый раз - сбрасываем флаги ожидания пополнения
                dispatch(setIsFirstTime(false));
                dispatch(setNeedDeposit(false));
                dispatch(setWaitingForDeposit(false));
                dispatch(setOnboardingCompleted(true));
            }
        }
    }, [user, wallet, history, dispatch]);

    // Проверяем историю каждые 2 минуты если ожидаем пополнения
    useEffect(() => {
        if (isWaitingForDeposit && user) {
            const checkHistory = async () => {
                try {
                    await dispatch(fetchHistory()).unwrap();
                } catch (error) {
                    console.error('Ошибка при проверке истории:', error);
                }
            };

            // Проверяем сразу
            checkHistory();

            // Устанавливаем интервал на 2 минуты
            const interval = setInterval(checkHistory, 120000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [isWaitingForDeposit, user, dispatch]);

    // Проверяем, появились ли новые транзакции
    useEffect(() => {
        if (history && history.length > 0 && isWaitingForDeposit) {
            const latestTransaction = history[0];
            if (latestTransaction && latestTransaction.status === 'completed') {
                // Пополнение успешно - раздизейбливаем все
                dispatch(setNeedDeposit(false));
                dispatch(setWaitingForDeposit(false));
                dispatch(setIsFirstTime(false));
            }
        }
    }, [history, isWaitingForDeposit, dispatch]);

    if (loadingApp || !user) {
        return <Loader className="h-[100dvh]" />;
    }

    // Показываем онбординг если не завершен онбординг
    if (!onboardingCompleted) {
        return <Onboarding />;
    }

    // Показываем экран создания PIN, если пользователь выбрал его создать
    if (showPinSetup) {
        return (
            <PinCodeScreen
                mode="setup"
                onCancel={() => {
                    setShowPinSetup(false);
                    dispatch(setShowPinOfferModal(false));
                }}
                onSuccess={() => {
                    setShowPinSetup(false);
                    dispatch(setShowPinOfferModal(false));
                }}
            />
        );
    }

    // Проверяем, нужно ли показать модалку предложения PIN после онбординга
    const shouldShowPinModal = !hasPin && showPinOfferModal && onboardingCompleted;

    const handleClosePinModal = () => {
        dispatch(setShowPinOfferModal(false));
    };

    const handleCreatePin = () => {
        setShowPinSetup(true);
    };

    return (
        <>
            <main>
                <Main />
            </main>
            {shouldShowPinModal && (
                <SettingPinModal showModal={true} onClose={handleClosePinModal} onCreatePin={handleCreatePin} />
            )}
        </>
    );
}
