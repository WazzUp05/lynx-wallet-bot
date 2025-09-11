import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import DragIndicator from "./ui/DragIndicator";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal = ({ open, onClose, children }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!open) return;

        document.body.style.overflow = open ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
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
                modalRef.current.style.transform = keyboardHeight > 0 ? `translateY(-${keyboardHeight}px)` : "";
            }
        };

        window.visualViewport?.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.visualViewport?.removeEventListener("resize", handleResize);
            if (open && modalRef.current) modalRef.current.style.transform = "";
        };
    }, [open]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[1000] h-[100dvh] flex items-end justify-center bg-black/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        ref={modalRef}
                        className="bg-white rounded-t-[2rem] p-[1.6rem] w-[100%] max-w-[991px] flex flex-col items-center"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "tween", duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                        drag="y"
                        dragConstraints={{ top: 0 }}
                        dragElastic={{ top: 0, bottom: 0.2 }}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 50) onClose();
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <DragIndicator className="mb-[1.6rem]" />
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default Modal;
