export function DirectoryDock() {
  return (
    <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/95 text-white text-[10px] font-mono px-5 py-2.5 rounded-full shadow-2xl hidden sm:flex items-center gap-4 border border-neutral-800/80 backdrop-blur-md z-50">
      <span className="flex items-center gap-1.5 text-neutral-300">
        <kbd className="bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 rounded text-[9px] text-white">↑↓</kbd> NAVIGATE
      </span>
      <span className="text-neutral-700">•</span>
      <span className="flex items-center gap-1.5 text-neutral-300">
        <kbd className="bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 rounded text-[9px] text-white">↵</kbd> OPEN
      </span>
      <span className="text-neutral-700">•</span>
      <span className="flex items-center gap-1.5 text-neutral-300">
        <kbd className="bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 rounded text-[9px] text-white">/</kbd> SEARCH
      </span>
      <span className="text-neutral-700">•</span>
      <span className="flex items-center gap-1.5 text-neutral-300">
        <kbd className="bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 rounded text-[9px] text-white">ESC</kbd> CLEAR
      </span>
    </footer>
  );
}
