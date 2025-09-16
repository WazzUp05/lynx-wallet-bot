"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setOnboardingCompleted } from "@/lib/redux/slices/appSlice";
import ArrowRight from "@/components/icons/right-arrow.svg";

const Onboarding: React.FC = () => {
    const [step, setStep] = useState(0);
    const dispatch = useAppDispatch();

    const steps = [
        {
            image: "/onboarding/step1.png",
            title: "Платежи по QR-коду <span style='color: var(--blue);'>в&nbsp;России</span>",
            description:
                "Оплачивайте покупки и услуги в России за секунды: отсканируйте QR-код и подтвердите оплату в Lynx Wallet.",
            button: "Далее",
        },
        {
            image: "/onboarding/step2.png",
            title: "Похоже на криптокарту, но <span style='color: var(--blue);'>через&nbsp;крипто&nbsp;СБП</span>",
            description: "Совершайте оплату по QR-кодам в рублевых терминалах прямо с криптокошелька Lynx Wallet.",
            button: "Далее",
        },
        {
            image: "/onboarding/step3.png",
            title: "Переводы<br> <span style='color: var(--blue);'>без&nbsp;комиссии</span>",
            description:
                "Отправляйте криптовалюту пользователям Lynx Wallet быстро, удобно и бесплатно — без скрытых платежей и ограничений.",
            button: "Далее",
        },
        {
            image: "/onboarding/step4.png",
            title: "<span style='color: var(--blue);'>Быстрое</span><br> пополнение счёта",
            description:
                "Пополняйте кошелёк удобными криптовалютами в несколько кликов — просто, безопасно и без лишних действий.",
            button: "Перейти в кошелёк",
        },
    ];
    const handleNext = () => {
        if (step < steps.length - 1) setStep(step + 1);
        else handleSkip();
    };

    const handleSkip = () => {
        if (typeof window !== "undefined") {
            localStorage.setItem("onboardingCompleted", "true");
        }
        dispatch(setOnboardingCompleted(true));
    };

    return (
        <div
            className="flex z-[1000] relative flex-col bg-[url('/onboarding/bg.png')] bg-cover bg-center pt-[2rem]"
            style={{
                minHeight: "calc(100dvh)",
            }}
        >
            {/* Progress */}
            <div className="flex justify-center items-center gap-[0.5rem] mb-2">
                {steps.map((_, i) => (
                    <span
                        key={i}
                        onClick={() => setStep(i)}
                        className={`h-[0.3rem] w-[2rem] rounded-full transition-all duration-200 ${
                            i <= step ? "bg-[var(--blue)]" : "bg-[var(--gray)]"
                        }`}
                    />
                ))}
                <span
                    onClick={handleSkip}
                    className="text-[var(--gray)] absolute flex items-center gap-[0.5rem] text-[1.4rem] leading-[130%] right-[1.6rem]"
                >
                    Пропустить <ArrowRight />
                </span>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-end ">
                <div className="w-full flex flex-col items-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`absolute top-[9.1rem] ${
                                step === 0 ? "w-[32rem] h-[32rem]" : "w-[26rem] h-[37.4rem]"
                            } ${step === 2 || step === 3 ? "h-[53.8rem]" : ""} mb-[1rem]`}
                        >
                            <Image
                                src={steps[step].image}
                                alt={steps[step].title}
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>
                    </AnimatePresence>
                    <div className="bg-white rounded-t-[2rem]  w-full relative pt-[2.5rem] pb-[2rem] px-[1.6rem] flex flex-col items-center">
                        <h2
                            className="fs-bold text-center mb-[1rem]"
                            dangerouslySetInnerHTML={{ __html: steps[step].title }}
                        />
                        <p className="fs-regular text-[var(--gray)] text-center mb-[3rem]">{steps[step].description}</p>
                        <Button className="" onClick={handleNext}>
                            {steps[step].button}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
