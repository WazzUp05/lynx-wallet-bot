import Copy from "@/components/icons/copy-white.svg";
import { useEffect, useState } from "react";
import CheckGreen from "@/components/icons/check-green.svg";

interface CopyButtonProps {
    text: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
        } catch (e) {
            console.error("Не удалось скопировать", e);
        }
    };

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    return (
        <div className="inline-block">
            <button type="button" onClick={handleCopy} className="center">
                <Copy />
            </button>
            {copied && (
                <div className="fixed top-[4rem] left-1/2 transform -translate-x-1/2 bg-[var(--dark-gray-main)] text-[var(--text-main)] text-xs px-2 py-1 rounded-[1.3rem] shadow-lg opacity-90 animate-fade-in flex items-center gap-1 px-[0.8rem] py-[0.4rem] z-50">
                    <CheckGreen
                        width={20}
                        height={20}
                        className="inline-block mr-1 w-[2rem] h-[2rem]"
                    />
                    <p className="fs-very-small-bold">Скопировано</p>
                </div>
            )}
        </div>
    );
};

export default CopyButton;
