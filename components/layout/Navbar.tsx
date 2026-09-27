import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-neutral-200 pb-4 text-[11px] font-mono tracking-[0.2em] uppercase">
      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 bg-black rounded-none" />
        <span className="font-bold text-black tracking-widest text-xs">DOSSIER//ANALYTICS</span>
      </div>

      <div className="flex items-center gap-6">
        <Link
          href="/players"
          className="text-neutral-500 hover:text-black transition-colors hidden sm:inline-block"
        >
          Directory
        </Link>
        <Link
          href="/ingest"
          className="text-neutral-500 hover:text-black transition-colors hidden sm:inline-block"
        >
          Ingestion
        </Link>
        <Link
          href="/players"
          className="px-3.5 py-1.5 bg-black text-white text-[10px] tracking-[0.2em] hover:bg-neutral-800 transition-colors"
        >
          LAUNCH APP →
        </Link>
      </div>
    </nav>
  );
}