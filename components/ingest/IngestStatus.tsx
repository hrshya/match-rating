interface IngestStatusProps {
  error: string | null;
  success: { processedRows: number } | null;
  onViewDirectory: () => void;
}

export function IngestStatus({ error, success, onViewDirectory }: IngestStatusProps) {
  return (
    <>
      {error && (
        <div className="p-4 bg-red-50 border-l-2 border-red-600 space-y-1">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-600">Sync Failure</p>
          <p className="text-xs font-mono text-red-900 leading-relaxed">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-6 bg-emerald-950 text-white border border-emerald-900 space-y-4 shadow-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Ingestion Successful</span>
            </div>
            <p className="text-sm font-sans font-light text-neutral-200">
              Ingested and re-calculated percentile ratings for <strong className="font-mono text-white text-base">{success.processedRows}</strong> match appearance records.
            </p>
          </div>

          <button
            onClick={onViewDirectory}
            className="w-full sm:w-auto text-xs font-mono uppercase tracking-widest bg-white text-black px-5 py-2.5 hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
          >
            <span>View Directory</span>
            <span>→</span>
          </button>
        </div>
      )}
    </>
  );
}
