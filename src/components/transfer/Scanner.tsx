import QrScanner from "@/components/QrScanner";
import Modal from "@/components/Modal";
import React from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setTransferAddress } from "@/lib/redux/slices/transferSlice";
import { useMixpanel } from "@/lib/providers/MixpanelProvider";

interface ScannerProps {
    open: boolean;
    onClose: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ open, onClose }) => {
    const { trackEvent } = useMixpanel();
    const dispatch = useAppDispatch();
    const handleResult = (result: string) => {
        trackEvent("transfer_step2_qr_scanner_scanned", { address: result });
        dispatch(setTransferAddress(result));
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={() => {
                onClose();
                trackEvent("transfer_step2_qr_scanner_closed");
            }}
            closable={true}
            swipeToClose={false}
        >
            <div className="min-h-[75dvh] flex flex-col justify-evenly my-[2rem] gap-[2.5rem]">
                <div className="rounded-2xl overflow-hidden center self-center">
                    <QrScanner
                        onResult={handleResult}
                        zoom={true}
                        torch={true}
                        onOff={true}
                        finder={true}
                    />
                </div>
                <p className="text-center text-[var(--text-secondary)]">
                    Наведите камеру на QR-код для сканирования адреса
                </p>
            </div>
        </Modal>
    );
};

export default Scanner;
