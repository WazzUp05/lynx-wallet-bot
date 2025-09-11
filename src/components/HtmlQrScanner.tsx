import { Html5QrcodeScanner, QrcodeErrorCallback, QrcodeSuccessCallback } from "html5-qrcode";
import { Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";
import { useEffect } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

interface Html5QrcodePluginProps {
    fps?: number;
    qrbox?: number | { width: number; height: number };
    aspectRatio?: number;
    disableFlip?: boolean;
    verbose?: boolean;
    qrCodeSuccessCallback: QrcodeSuccessCallback;
    qrCodeErrorCallback?: QrcodeErrorCallback;
}

// Creates the configuration object for Html5QrcodeScanner.

const createConfig = (props: Html5QrcodePluginProps): Html5QrcodeScannerConfig => {
    return {
        fps: props.fps,
        qrbox: props.qrbox,
        aspectRatio: props.aspectRatio,
        disableFlip: props.disableFlip,
    };
};

const Html5QrcodePlugin: React.FC<Html5QrcodePluginProps> = (props) => {
    useEffect(() => {
        // when component mounts
        const config = createConfig(props);
        const verbose = props.verbose === true;
        // Suceess callback is required.
        if (!props.qrCodeSuccessCallback) {
            throw new Error("qrCodeSuccessCallback is required callback.");
        }
        const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
        html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);

        // cleanup function when component will unmount
        return () => {
            html5QrcodeScanner.clear().catch((error: unknown) => {
                if (error instanceof Error) {
                    console.error("Failed to clear html5QrcodeScanner. ", error.message);
                } else {
                    console.error("Failed to clear html5QrcodeScanner. ", error);
                }
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div id={qrcodeRegionId} />;
};

export default Html5QrcodePlugin;
