'use client';
import { forwardRef, useRef, useImperativeHandle } from 'react';

export type HiddenFileInputsRef = {
    openGallery: () => void;
    openFiles: () => void;
};

type HiddenFileInputProps = {
    onSendFile: (file: File) => void;
    setShowModal: (show: boolean) => void;
};

export const HiddenFileInput = forwardRef<HiddenFileInputsRef, HiddenFileInputProps>(
    ({ onSendFile, setShowModal }, ref) => {
        const galleryInputRef = useRef<HTMLInputElement | null>(null);
        const fileInputRef = useRef<HTMLInputElement | null>(null);

        const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            const fileArray = Array.from(files);

            fileArray.forEach((file) => {
                onSendFile(file);
            });

            setShowModal(false);

            e.target.value = '';
        };

        useImperativeHandle(ref, () => ({
            openGallery() {
                if (galleryInputRef.current) {
                    galleryInputRef.current.value = '';
                    galleryInputRef.current.click();
                }
            },
            openFiles() {
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                    fileInputRef.current.click();
                }
            },
        }));

        return (
            <>
                <input
                    ref={galleryInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="opacity-[0] w-full h-full pointer-events-none absolute top-[0] left-[0]"
                    onChange={handleFileSelect}
                />
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.txt,.doc,.docx,.xls,.xlsx,.zip,.rar,.7z"
                    className="opacity-[0] w-full h-full pointer-events-none absolute bottom-[0] right-[0]"
                    onChange={handleFileSelect}
                />
            </>
        );
    }
);

HiddenFileInput.displayName = 'HiddenFileInput';
