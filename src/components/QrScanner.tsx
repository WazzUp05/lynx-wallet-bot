import { Scanner, TrackFunction, IDetectedBarcode } from '@yudiel/react-qr-scanner';

export interface IScannerComponents {
  tracker?: TrackFunction;
  onOff?: boolean;
  torch?: boolean;
  zoom?: boolean;
  finder?: boolean;
  paused?: boolean;
  onResult?: (result: string) => void;
}

const QrScanner: React.FC<IScannerComponents> = (props) => {
  const { tracker, onOff, torch, zoom, finder, onResult, paused } = props;

  return (
    <Scanner
      components={{ finder, onOff, torch, zoom, tracker }}
      sound={true}
      paused={paused}
      allowMultiple={true}
      scanDelay={500}
      onScan={(results: IDetectedBarcode[]) => {
        if (onResult && results && results.length > 0) {
          onResult(results[0].rawValue); // передаём строку
        }
      }}
    />
  );
};

export default QrScanner;
