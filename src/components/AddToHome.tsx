import React from 'react';
import ArrowTopLeft from '@/components/icons/arrow-top-left.svg';
import Image from 'next/image';
import { Button } from './ui/Button';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

interface AddToHomeProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const AddToHome = ({ isOpen, setIsOpen }: AddToHomeProps) => {
    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[1000] w-full px-[1.6rem] h-[100dvh] flex items-end justify-center bg-black/70"
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ArrowTopLeft
                        width={54}
                        height={106}
                        className="w-[5.4rem] h-[10.6rem] absolute top-0 right-[1.6rem]"
                    />
                    <div className="fixed bottom-0 w-[93%] mx-auto  left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
                        <div className="flex items-center flex-col bg-[var(--dark-gray-main)] rounded-[2rem] p-[1.6rem]">
                            <div className="flex items-center gap-[1.6rem] mb-[1.2rem]">
                                <Image
                                    src="/add-home.png"
                                    alt="add-home"
                                    width={66}
                                    height={72}
                                    className="w-[6.6rem] h-[7.2rem]"
                                />
                                <h2 className="text-[1.8rem] leading-[130%] font-semibold text-[var(--text-main)]">
                                    Чтобы не потерять Lynx, добавьте его на экран вашего смартфона
                                </h2>
                            </div>
                            <p className="text-[1.3rem] leading-[130%] mb-[2.4rem] text-[var(--text-secondary)]">
                                Нажмите на три точки в правом верхнем углу. Затем выберите пункт «Добавить на экран
                                домой» и следуйте дальнейшим инструкциям.
                            </p>
                            <Button variant="gray" onClick={() => setIsOpen(false)}>
                                Закрыть
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default AddToHome;
