interface DirectoryHeaderProps {
  isLoading: boolean;
  recordCount: number;
  ageGroups: string[];
  selectedAgeGroup: string;
  onSelectAgeGroup: (group: string) => void;
}

export function DirectoryHeader({
  isLoading,
  recordCount,
  ageGroups,
  selectedAgeGroup,
  onSelectAgeGroup,
}: DirectoryHeaderProps) {
  return (
    <header className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3 text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-black font-medium">Scout Engine</span>
        </div>
        <div className="flex items-center gap-4">
          <span>INDEX / 2026</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">
            {isLoading ? 'SYNCING...' : `${recordCount} RECORDS`}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-2">
        <div className="space-y-1.5">
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-black">
            Directory
          </h1>
          <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed max-w-sm">
            Positional percentile rankings derived from age-adjusted performance models.
          </p>
        </div>

        {!isLoading && ageGroups.length > 0 && (
          <div className="inline-flex border border-neutral-200/80 bg-white/80 p-0.5 rounded-full text-[10px] font-mono shadow-xs">
            <button
              onClick={() => onSelectAgeGroup('all')}
              className={`px-3 py-1 rounded-full uppercase tracking-wider transition-all ${
                selectedAgeGroup === 'all'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              All
            </button>
            {ageGroups.map((group) => (
              <button
                key={group}
                onClick={() => onSelectAgeGroup(group)}
                className={`px-3 py-1 rounded-full uppercase tracking-wider transition-all ${
                  selectedAgeGroup === group
                    ? 'bg-black text-white shadow-xs'
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
