import { ChangeEvent, DragEvent } from 'react';

interface FileDropzoneProps {
  isDragging: boolean;
  isUploading: boolean;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function FileDropzone({
  isDragging,
  isUploading,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
}: FileDropzoneProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative border-2 border-dashed transition-all duration-200 p-8 sm:p-12 text-center bg-white/60 ${
        isDragging
          ? 'border-black bg-neutral-100/80 scale-[0.99]'
          : 'border-neutral-300 hover:border-neutral-400'
      }`}
    >
      <input
        type="file"
        accept=".csv"
        onChange={onFileChange}
        className="hidden"
        id="csv-file-input"
        disabled={isUploading}
      />
      <label
        htmlFor="csv-file-input"
        className="cursor-pointer flex flex-col items-center gap-3 group"
      >
        <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 group-hover:bg-black group-hover:text-white transition-colors duration-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M12 16.5V3.75m0 0L7.5 8.25M12 3.75l4.5 4.5M3.75 19.5h16.5"
            />
          </svg>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-black group-hover:underline">
            Click to browse or drag CSV file here
          </p>
          <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
            SUPPORTS .CSV MATCH LOG EXPORTS ONLY
          </p>
        </div>
      </label>
    </div>
  );
}