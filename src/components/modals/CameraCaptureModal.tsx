import Webcam from "react-webcam";
import Modal from '@/components/Modal';
import React, {useRef, useCallback, useState} from "react";
import Image from "next/image";

type CameraCaptureProps = {
    showCamera: boolean
    setShowCamera: (show: boolean) => void
}

const CameraCaptureModal: React.FC<CameraCaptureProps> = ({showCamera, setShowCamera}) => {

  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    }
 
  }, [webcamRef, setImgSrc]);

    return <Modal swipeToClose={false} closable open={showCamera} onClose={() => {setShowCamera(false)}}>
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
        </Modal>
    
}

// export default CameraCaptureModal;