import Docx from '@/components/icons/docx.svg';
import Pdf from '@/components/icons/pdf.svg';
import Xlsx from '@/components/icons/xlsx.svg';
import { MessageType } from '@/components/ui/SupportChat/SupportChat';

type FileMessageProps = {
    msg: MessageType;
};

const FileMessage: React.FC<FileMessageProps> = ({ msg }) => {
    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} Б`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
    };

    const size = msg.fileSize ? formatSize(msg.fileSize) : '';

    const ext = msg.text?.split('.').pop()?.toLowerCase();

    const IconComponent =
        ext === 'pdf'
            ? Pdf
            : ext === 'doc' || ext === 'docx'
              ? Docx
              : ext === 'xls' || ext === 'xlsx'
                ? Xlsx
                : Docx;

    return (
        <div className="ml-[4em] flex justify-end">
            <div className="flex flex-col gap-[-0.8rem] bg-[var(--text-additional)] rounded-[2rem] px-[1.2rem] py-[1rem]">
                <div className="self-end flex gap-[1rem] items-start">
                    <IconComponent 
                    // height={30} width={25} 
                    className="w-auto h-[2em] self-start shrink-[0]" />
                    <div className="flex flex-col pr-[3em] gap-[0.5rem]">
                        <div className="fs-very-small text-[var(--text-main)] whitespace-pre-wrap break-all ">
                            {msg.text}
                        </div>
                        <div className="fs-xx-small text-[var(--text-secondary)]">{size}</div>
                    </div>
                </div>
                <div className="self-end fs-xx-small text-[var(--text-secondary)]">
                    {msg.timestamp.getHours().toString().padStart(2, '0')}:
                    {msg.timestamp.getMinutes().toString().padStart(2, '0')}
                </div>
            </div>
        </div>
    );
};

export default FileMessage;
