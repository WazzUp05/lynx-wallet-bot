'use client'
import Modal from '@/components/Modal';
import Camera from '@/components/icons/camera.svg';
import Gallery from '@/components/icons/gallery.svg';
import FileIcon from '@/components/icons/files.svg';
import { useRouter } from 'next/navigation';
import React from 'react';

type AddFileModalProps = {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    onOpenGallery: () => void;
    onOpenFiles: () => void;
};

const AddFileModal: React.FC<AddFileModalProps> = ({
    showModal,
    setShowModal,
    onOpenGallery,
    onOpenFiles,
}) => {
    const router = useRouter();

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
                    onClick={onOpenGallery}
                >
                    <div className="w-[35px] h-[35px] bg-[var(--yellow-secondary)] center rounded-[10px]">
                        <Gallery />
                    </div>
                    <div className="text-[var(--text-secondary)] fs-very-small-bold ">Галерея</div>
                </div>
                <div
                    className="flex items-center gap-[1rem] mb-[1.6rem] bg-[var(--bg-secondary)] rounded-[15px] p-[1rem]"
                    onClick={onOpenFiles}
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
