'use client';
import Webcam from 'react-webcam';
import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ArrowLeft from '@/components/icons/arrow-left.svg';
import CloseIcon from '@/components/icons/close.svg';
import Shooting from '@/components/icons/shooting.svg';
// import Flash from '@/components/icons/flash.svg'
import Refresh from '@/components/icons/refresh.svg';
import InputSupportChat from '@/components/ui/SupportChat/InputSupportChat';

const CameraCapture = () => {
    const router = useRouter();
    const webcamRef = useRef<Webcam>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [cameraMode, setCameraMode] = useState('environment');
    const [mode, setMode] = useState<'camera' | 'preview'>('camera');

    const videoConstraints = {
        facingMode: { exact: cameraMode },
    };

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setImgSrc(imageSrc);
            setMode('preview');
        }
    }, [webcamRef, setImgSrc]);

    const handleChangeCamMode = () => {
        if (cameraMode === 'environment') setCameraMode('user');
        if (cameraMode === 'user') setCameraMode('environment');
    };

    useEffect(() => {
        const ref = webcamRef.current;
        return () => {
            if (ref && ref.stream) {
                ref.stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <div className="flex flex-col gap-[1rem] w-full h-[100dvh]">
            <div className="p-[1.6rem] flex">
                {mode === 'preview' && imgSrc && (
                    <button
                        className="sefl-start top-[1.6rem] left-[1.6rem] bg-[var(--bg-secondary)] rounded-[1rem] w-[3.5rem] h-[3.5rem] center"
                        onClick={() => setMode('camera')}
                    >
                        <ArrowLeft />
                    </button>
                )}
                <button
                    className="bg-[var(--bg-secondary)] self-end rounded-[1rem] w-[3.5rem] h-[3.5rem] center ml-auto text-[var(--text-secondary)]"
                    onClick={() => router.back()}
                >
                    <CloseIcon width={15} height={15} className="w-[1.5rem] h-[1.5rem]" />
                </button>
            </div>

            {mode === 'camera' && (
                <div className="flex flex-col gap-[1.6rem] grow">
                    <div className="relative w-full aspect-[3/4] max-h-[72dvh] overflow-hidden">
                        `{' '}
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex justify-around items-center bg-[var(--bg-optional)]">
                        <button
                            className="w-[50px] h-[50px] center rounded-full bg-[var(--dark-gray-main)]"
                            onClick={() => handleChangeCamMode()}
                        >
                            <Refresh className="w-[24px] h-[24px]" />
                        </button>
                        <button className="center" onClick={() => capture()}>
                            <Shooting className="w-[60px] h-[60px]" />
                        </button>
                        {/* <button className='hidden w-[50px] h-[50px] center rounded-full bg-[var(--dark-gray-main)]'>
                            <Flash className='w-[24px] h-[24px]'/>
                        </button> */}
                    </div>
                </div>
            )}
            {mode === 'preview' && imgSrc && (
                <div className="flex flex-col grow h-full gap-[1.6rem]">
                    <div className="grow center">
                        <Image
                            src={imgSrc}
                            alt="Captured"
                            className="w-auto h-auto max-h-[72dvh] object-cover"
                            width={720}
                            height={960}
                        />
                    </div>
                    <div className="p-[1.6rem]">
                        <InputSupportChat mode={mode} imgSrc={imgSrc} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CameraCapture;
