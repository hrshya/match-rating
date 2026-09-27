import Link from 'next/link';

export function Hero() {
  return (
    <section className="space-y-8 pt-6 sm:pt-12">
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-neutral-300 text-[10px] font-mono uppercase tracking-[0.2em] bg-white">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>COHORT PERCENTILE RATING ENGINE</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-light tracking-tight text-black leading-[1.05]">
          Precision scouting for modern youth football.
        </h1>

        <p className="text-neutral-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal pt-2">
          Transform raw match log exports into age-adjusted percentile ratings. Benchmark academy prospects against peer cohorts with editorial-grade dossiers.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
        <Link
          href="/players"
          className="px-8 py-4 bg-black text-white text-xs font-mono uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all text-center shadow-xs"
        >
          Explore Player Directory
        </Link>
        <Link
          href="/uploads"
          className="px-8 py-4 bg-white border border-neutral-300 text-black text-xs font-mono uppercase tracking-[0.2em] hover:border-black transition-all text-center"
        >
          Upload Match Data (.CSV)
        </Link>
      </div>
    </section>
  );
}
