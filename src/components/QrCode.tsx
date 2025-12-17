'use client';

import { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';

type QRProps = {
    data: string;
    size?: number;
    image?: string;
};

export default function QRCode({ data, size = 150, image }: QRProps) {
    const imageSrc = image ? image : '/icons/qr-icon.svg';
    const ref = useRef<HTMLDivElement>(null);

    const qrCode = useRef(
        new QRCodeStyling({
            width: size,
            height: size,
            data,
            type: 'svg', // или "canvas"
            margin: 0,
            dotsOptions: {
                color: '#fff',
                type: 'rounded',
            },
            backgroundOptions: {
                color: 'transparent',
            },
            cornersSquareOptions: {
                type: 'extra-rounded',
                color: '#fff',
            },
            image: imageSrc,
            imageOptions: {
                crossOrigin: 'anonymous',

                imageSize: 0.4,
            },
        })
    );

    useEffect(() => {
        if (ref.current) {
            qrCode.current.append(ref.current);
        }
    }, []);

    useEffect(() => {
        qrCode.current.update({ data });
    }, [data]);

    return <div ref={ref} />;
}
