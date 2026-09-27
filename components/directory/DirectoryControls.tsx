import { RefObject } from 'react';

interface DirectoryControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  sortOrder: 'desc' | 'asc';
  onSortChange: (order: 'desc' | 'asc') => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
}

export function DirectoryControls({
  searchQuery,
  onSearchChange,
  onClearSearch,
  sortOrder,
  onSortChange,
  searchInputRef,
}: DirectoryControlsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end pb-3 border-b border-black">
      <div className="sm:col-span-2 relative">
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
            Search Directory
          </label>
          <span className="text-[10px] font-mono text-neutral-300 hidden sm:inline">
            <kbd className="bg-neutral-100 px-1 py-0.5 border border-neutral-200 text-neutral-500 rounded-sm"> / </kbd>
          </span>
        </div>
        <div className="relative flex items-center">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Type athlete name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent text-lg sm:text-xl text-black placeholder-neutral-300 focus:outline-none pr-12 font-normal tracking-tight"
          />
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="absolute right-0 text-[10px] font-mono text-neutral-400 hover:text-black uppercase tracking-wider"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
          Order By
        </label>
        <div className="relative">
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value as 'desc' | 'asc')}
            className="w-full bg-transparent text-xs font-mono uppercase tracking-wider text-black focus:outline-none cursor-pointer appearance-none py-1.5 pr-6 border-b border-transparent focus:border-black transition-colors"
          >
            <option value="desc">Highest Percentile</option>
            <option value="asc">Lowest Percentile</option>
          </select>
          <span className="absolute right-0 bottom-1.5 pointer-events-none text-xs text-neutral-400">
            ↓
          </span>
        </div>
      </div>
    </div>
  );
}
