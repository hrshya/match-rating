import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-neutral-400 uppercase tracking-widest gap-4">
      <div>DOSSIER SCOUTING PLATFORM • NEXT.JS APP ROUTER</div>
      <div className="flex items-center gap-6">
        <Link href="/players" className="hover:text-black transition-colors">Directory</Link>
        <Link href="/ingest" className="hover:text-black transition-colors">Ingestion Pipeline</Link>
      </div>
    </footer>
  );
}