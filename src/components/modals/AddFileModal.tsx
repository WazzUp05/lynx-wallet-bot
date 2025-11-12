import Modal from '@/components/Modal';
import Camera from '@/components/icons/camera.svg';
import Gallery from '@/components/icons/gallery.svg';
import FileIcon from '@/components/icons/files.svg';
import ArrowLeft from '@/components/icons/arrow-left.svg';

import Image from "next/image";
import Webcam from "react-webcam";
import React, {useRef, useCallback, useState} from "react";


type AddFileModalProps = {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    onSendFile?: (file: File, caption?: string) => void;
}

const AddFileModal: React.FC<AddFileModalProps> = ({showModal, setShowModal, onSendFile}) => {

    // const cameraInputRef = useRef<HTMLInputElement | null>(null);
    const galleryInputRef = useRef<HTMLInputElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const webcamRef = useRef<Webcam>(null);


    const [mode, setMode] = useState<'menu' | 'camera' | 'preview'>('menu');
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [caption, setCaption] = useState('');

    const handleBack = () => {
    setImgSrc(null);
    setCaption('');
    setMode('menu');
    };

   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    setMode('preview');
  };

    const handleSend = () => {
    if (!imgSrc) return;
    fetch(imgSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onSendFile?.(file, caption);
        handleBack();
        setShowModal(false);
      });
    };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImgSrc(imageSrc);
        setMode('preview');
      }
    }
  }, []);

  
 
  return (
    
            <Modal 
            closable={true} 
            title={
                mode === 'camera' || 'preview' ? '' : 'Выберете действие'
            } 
            open={showModal} 
            onClose={() => {
                setShowModal(false);
                handleBack();
            }}
            >

            <input 
            ref={galleryInputRef}
            type='file'
            multiple
            accept='image/*'
            style={{ opacity: 0, width: 0, height: 0, position: "absolute" }} // проверить
            onChange={handleFileSelect}
            />

            <input 
            ref={fileInputRef}
            type='file'
            multiple
            style={{ opacity: 0, width: 0, height: 0, position: "absolute" }} // проверить
            // onChange={handleFileSelect}
            />

            {mode === 'menu' && 
                <div className='flex flex-col w-[100%]'>
                    <div 
                    className='flex items-center gap-[1rem] mb-[1.6rem] bg-[var(--bg-secondary)] rounded-[15px] p-[1rem]' 
                    onClick={
                        () => {setMode('camera')}
                    }
                    >
                        <div className='w-[35px] h-[35px] bg-[var(--yellow-secondary)] center rounded-[10px]'><Camera/></div>
                        <div className='text-[var(--text-secondary)] fs-very-small-bold '>Камера</div>
                    </div>
                    <div 
                    className='flex items-center gap-[1rem] mb-[1.6rem] bg-[var(--bg-secondary)] rounded-[15px] p-[1rem]'
                    onClick={() => galleryInputRef.current?.click()}
                    >
                        <div className='w-[35px] h-[35px] bg-[var(--yellow-secondary)] center rounded-[10px]'><Gallery/></div>
                        <div className='text-[var(--text-secondary)] fs-very-small-bold '>Галерея</div>
                    </div>
                    <div 
                    className='flex items-center gap-[1rem] mb-[1.6rem] bg-[var(--bg-secondary)] rounded-[15px] p-[1rem]'
                    onClick={() => fileInputRef.current?.click()}
                    >
                        <div className='w-[35px] h-[35px] bg-[var(--yellow-secondary)] center rounded-[10px]'><FileIcon/></div>
                        <div className='text-[var(--text-secondary)] fs-very-small-bold '>Файлы</div>
                    </div>
                </div>
            }

            {mode === 'camera' && 
                <div>
                    <button onClick={capture}>Capture photo</button>
                    <Webcam 
                    audio={false}
                    height={720}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={1280}
                    />
                    {imgSrc && (
                        <Image 
                        src={imgSrc} 
                        alt="Captured" 
                        className=""
                        width={200}
                        height={200}/>
                    )}
                    <div
                        className="absolute top-[1rem] left-[1rem] bg-[var(--bg-secondary)] rounded-[1rem] w-[3.5rem] h-[3.5rem] center"
                        onClick={() => setMode('menu')}
                        >  
                        <ArrowLeft /> 
                    </div>
                </div>
            }

            {mode === 'preview' && imgSrc &&
                 <div className='flex flex-col items-center gap-[1rem]'>
                    preview
                </div>
            }
        </Modal>




  );
}

export default AddFileModal;