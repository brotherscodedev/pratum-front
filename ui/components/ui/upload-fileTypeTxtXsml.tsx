import  { FC } from 'react';
import BotaoUpload, { FileUploaded } from "@/components/crud/upload";

import { formatSize } from '@/lib/utils';

type UploadInputPropsType = {
  file: FileUploaded | undefined;
  onUpload: (file: FileUploaded) => void;
  onClear: () => void;
};

const UploadInput: FC<UploadInputPropsType> = ({ file, onUpload, onClear }) => {

  const renderUploadContent = () => (
    <div className="flex flex-row border-cyan-300 max-w-72 text-xs bg-slate-800 rounded-sm">
      <a href={file?.url} className="px-2 py-1" target="_blank">
        <p>{file?.nome}</p>
        <p>{formatSize(file?.tamanho)}</p>
      </a>
      <button
        type="button"
        className="flex justify-center items-center bg-slate-600 hover:bg-slate-500 pl-1 pr-1 text-sm ml-2 rounded-sm"
        onClick={onClear}
      >
        <div>x</div>
      </button>
    </div>
  );

  return file
    ? renderUploadContent()
    : <BotaoUpload onUpload={onUpload} />
}

export default UploadInput;