import Modal from '@/components/Modal';
import Camera from '@/components/icons/camera.svg';
import Gallery from '@/components/icons/gallery.svg';
import FileIcon from '@/components/icons/files.svg';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';

type AddFileModalProps = {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    onSendFile: (file: File) => void;
};

const AddFileModal: React.FC<AddFileModalProps> = ({ showModal, setShowModal, onSendFile }) => {
    const galleryInputRef = useRef<HTMLInputElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        console.log(files?.length);
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);

        fileArray.forEach((file) => {
            onSendFile(file);
        });

        setShowModal(false);

        e.target.value = '';
    };

    return (
        <Modal
            closable={true}
            title="Выберете действие"
            open={showModal}
            swipeToClose={false}
            onClose={() => {
                setShowModal(false);
            }}
        >
            <input
                ref={galleryInputRef}
                type="file"
                multiple
                accept="image/*"
                style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} // проверить
                onChange={handleFileSelect}
            />

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.txt,.doc,.docx,.xls,.xlsx,.zip,.rar,.7z"
                style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                onChange={handleFileSelect}
            />

            <div className="flex flex-col w-[100%]">
                <div
                    className="flex items-center gap-[1rem] mb-[1.6rem] bg-[var(--bg-secondary)] rounded-[15px] p-[1rem]"
                    onClick={() => {
                        router.push('/camera');
                    }}
                >
                    <div className="w-[35px] h-[35px] bg-[var(--yellow-secondary)] center rounded-[10px]">
                        <Camera />
                    </div>
                    <div className="text-[var(--text-secondary)] fs-very-small-bold ">Камера</div>
                </div>
                <div
                    className="flex items-center gap-[1rem] mb-[1.6rem] bg-[var(--bg-secondary)] rounded-[15px] p-[1rem]"
                    onClick={() => galleryInputRef.current?.click()}
                >
                    <div className="w-[35px] h-[35px] bg-[var(--yellow-secondary)] center rounded-[10px]">
                        <Gallery />
                    </div>
                    <div className="text-[var(--text-secondary)] fs-very-small-bold ">Галерея</div>
                </div>
                <div
                    className="flex items-center gap-[1rem] mb-[1.6rem] bg-[var(--bg-secondary)] rounded-[15px] p-[1rem]"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="w-[35px] h-[35px] bg-[var(--yellow-secondary)] center rounded-[10px]">
                        <FileIcon />
                    </div>
                    <div className="text-[var(--text-secondary)] fs-very-small-bold ">Файлы</div>
                </div>
            </div>
        </Modal>
    );
};

export default AddFileModal;
