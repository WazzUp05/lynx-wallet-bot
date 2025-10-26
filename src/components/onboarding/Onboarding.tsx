'use client';
import React from 'react';
import { useState } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setOnboardingCompleted } from '@/lib/redux/slices/appSlice';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import Step5 from './steps/Step5';
import CloseIcon from '@/components/icons/close.svg';
import ArrowLeftIcon from '@/components/icons/arrow-left.svg';

const Onboarding: React.FC = () => {
    const [step, setStep] = useState(0);
    const dispatch = useAppDispatch();

    const stepComponents = [Step1, Step2, Step3, Step4, Step5];
    const handleNext = () => {
        if (step < stepComponents.length - 1) setStep(step + 1);
        else handleSkip();
    };

    const handleSkip = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('onboardingCompleted', 'true');
        }
        dispatch(setOnboardingCompleted(true));
    };

    const handlePrev = () => {
        if (step > 0) setStep(step - 1);
    };
    return (
        <div
            className="flex z-[1000] relative flex-col pt-[2.4rem] overflow-hidden"
            style={{
                minHeight: 'calc(100dvh)',
            }}
        >
            {/* Progress */}
            <div className="flex w-full justify-between items-center px-[1.6rem] mb-2">
                <button
                    className={`bg-[var(--bg-secondary)]  rounded-[1rem] w-[3.5rem] h-[3.5rem] center  text-[var(--text-secondary)] ${
                        step === 0 ? 'opacity-0 pointer-events-none' : ''
                    }`}
                    onClick={handlePrev}
                    aria-label="Назад"
                >
                    <ArrowLeftIcon width={15} height={15} className="w-[1.5rem] h-[1.5rem]" />
                </button>
                {step < 3 && (
                    <div className="flex items-center gap-[0.5rem]">
                        {stepComponents
                            .filter((_, i) => i < 3)
                            .map((_, i) => (
                                <span
                                    key={i}
                                    onClick={() => setStep(i)}
                                    className={`h-[0.3rem] w-[2rem] rounded-full transition-all duration-200 ${
                                        i === step ? 'bg-[var(--yellow)]' : 'bg-[var(--text-main)]'
                                    }`}
                                />
                            ))}
                    </div>
                )}
                <button
                    className={`bg-[var(--bg-secondary)]  rounded-[1rem] w-[3.5rem] h-[3.5rem] center text-[var(--text-secondary)] ${
                        step === stepComponents.length - 1 ? '' : 'opacity-0 pointer-events-none'
                    }`}
                    onClick={handleSkip}
                    aria-label="Закрыть"
                >
                    <CloseIcon width={15} height={15} className="w-[1.5rem] h-[1.5rem]" />
                </button>
            </div>

            {/* Step Content */}
            {React.createElement(stepComponents[step], { onNext: handleNext })}
        </div>
    );
};

export default Onboarding;
