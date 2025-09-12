"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { Scanner } from "@yudiel/react-qr-scanner";
import QrScanner from "@/components/QrScanner";

export default function QrScanPage() {
    const [scanned, setScanned] = useState<string | null>(null);
    const [toast, setToast] = useState(false);

    const handleCopy = async () => {
        if (scanned) {
            alert("Адрес скопирован в буфер обмена: " + scanned);
            await navigator.clipboard.writeText(scanned);
            setToast(true);
            setTimeout(() => setToast(false), 2000);
        }
    };

    const onNewScanResult = (decodedText: string) => {
        alert(`QR Code detected: ${decodedText}`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            {!scanned ? (
                <>
                    <div className="rounded-2xl overflow-hidden mb-4 bg-[#e5e5e5]">
                        <QrScanner onResult={(result) => setScanned(result)} />
                    </div>
                    <p className="text-center text-gray-500 mb-2">Наведите камеру на QR-код</p>
                </>
            ) : (
                <div className="w-full flex flex-col items-center gap-4">
                    <div className="bg-gray-100 rounded-xl p-4 break-all text-center">{scanned}</div>
                    <Button onClick={handleCopy} className="w-full">
                        Скопировать ссылку
                    </Button>
                    <Button variant="ghost" onClick={() => setScanned(null)} className="w-full">
                        Сканировать снова
                    </Button>
                </div>
            )}
            {toast && <Toast open={toast} message="Адрес скопирован" onClose={() => setToast(false)} />}
        </div>
    );
}
