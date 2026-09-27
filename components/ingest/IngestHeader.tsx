import Link from 'next/link';

export function IngestHeader() {
  return (
    <header className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3 text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
        <Link
          href="/players"
          className="flex items-center gap-2 text-black hover:text-neutral-500 transition-colors group"
        >
          <span className="transition-transform duration-150 group-hover:-translate-x-1">←</span>
          <span className="font-medium">Directory</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>DATA PIPELINE / INGEST</span>
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-black">
          Data Ingestion
        </h1>
        <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed max-w-lg font-sans">
          Upload raw <code className="bg-neutral-200/60 px-1.5 py-0.5 rounded text-xs font-mono text-black">match_events.csv</code> exports to compute age-adjusted percentile ratings.
        </p>
      </div>
    </header>
  );
}
