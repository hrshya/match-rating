interface SelectedFileCardProps {
  file: File;
  isUploading: boolean;
  onRemove: () => void;
}

export function SelectedFileCard({ file, isUploading, onRemove }: SelectedFileCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-black shadow-xs font-mono">
      <div className="flex items-center space-x-3 overflow-hidden">
        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
        <span className="text-xs text-black font-medium truncate">{file.name}</span>
        <span className="text-[10px] text-neutral-400 shrink-0">
          ({(file.size / 1024).toFixed(1)} KB)
        </span>
      </div>
      <button
        type="button"
        onClick={onRemove}
        disabled={isUploading}
        className="text-[10px] text-neutral-400 hover:text-red-600 uppercase tracking-widest transition-colors disabled:opacity-50 ml-4 shrink-0"
      >
        REMOVE
      </button>
    </div>
  );
}