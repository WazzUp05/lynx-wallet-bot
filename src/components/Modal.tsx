import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@/components/icons/close.svg';

interface ModalProps {
    open: boolean;
    title?: string;
    onClose: () => void;
    children: ReactNode;
    closable?: boolean; // показать кнопку закрытия
    swipeToClose?: boolean; // разрешить свайп вниз
}

const Modal = ({
    open,
    title,
    onClose,
    children,
    closable = false,
    swipeToClose = true,
}: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!open) return;

        document.body.style.overflow = open ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    useEffect(() => {
        if (!open) return;

        const handleResize = () => {
            if (!modalRef.current) return;
            const viewport = window.visualViewport;
            if (viewport) {
                // Сдвигаем модалку вверх на разницу между window.innerHeight и viewport.height
                const keyboardHeight = window.innerHeight - viewport.height - viewport.offsetTop;
                modalRef.current.style.transform =
                    keyboardHeight > 0 ? `translateY(-${keyboardHeight}px)` : '';
            }
        };

        window.visualViewport?.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.visualViewport?.removeEventListener('resize', handleResize);
            if (open && modalRef.current) modalRef.current.style.transform = '';
        };
    }, [open]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[1000] h-[100dvh] flex items-end justify-center bg-black/70"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        ref={modalRef}
                        className="bg-[var(--bg-optional)] rounded-t-[2rem] p-[1.6rem] pb-[2.4rem] w-[100%] max-w-[991px] relative flex flex-col text-[var(--text-main)] items-center"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'tween', duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                        drag={swipeToClose ? 'y' : false}
                        dragConstraints={{ top: 0 }}
                        dragElastic={{ top: 0, bottom: 0.2 }}
                        onDragEnd={(_, info) => {
                            if (swipeToClose && info.offset.y > 50) onClose();
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* {swipeToClose && <DragIndicator className="mb-[1.6rem]" />} */}
                        {closable && (
                            <div className="flex w-full items-center justify-between mb-[1.6rem]">
                                {title && (
                                    <div className=" font-semibold text-[1.8rem] leading-[130%]">
                                        {title}
                                    </div>
                                )}
                                <button
                                    className="bg-[var(--bg-secondary)]  rounded-[1rem] w-[3.5rem] h-[3.5rem] center ml-auto text-[var(--text-secondary)]"
                                    onClick={onClose}
                                    aria-label="Закрыть"
                                >
                                    <CloseIcon
                                        width={15}
                                        height={15}
                                        className="w-[1.5rem] h-[1.5rem]"
                                    />
                                </button>
                            </div>
                        )}

                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default Modal;
