import { Player } from '@/types';

interface PlayerRowProps {
  player: Player;
  index: number;
  isKeyboardFocused: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}

export function PlayerRow({
  player,
  index,
  isKeyboardFocused,
  onMouseEnter,
  onClick,
}: PlayerRowProps) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={`group cursor-pointer transition-all duration-150 ease-out py-3.5 px-3 ${
        isKeyboardFocused ? 'bg-black text-white' : 'hover:bg-neutral-100/70 text-black'
      }`}
    >
      <div className="grid grid-cols-12 items-center">
        {/* Index */}
        <span
          className={`col-span-2 sm:col-span-1 text-[11px] font-mono ${
            isKeyboardFocused ? 'text-neutral-500' : 'text-neutral-300'
          }`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Name */}
        <div className="col-span-10 sm:col-span-6 flex flex-col justify-center">
          <span className="text-base sm:text-lg font-normal tracking-tight">
            {player.player.name}
          </span>
          <span className="text-[9px] font-mono uppercase tracking-wider mt-0.5 sm:hidden text-neutral-400">
            {player.ageGroup}
          </span>
        </div>

        {/* Age Group */}
        <span className="hidden sm:block col-span-2 text-center text-xs font-mono uppercase tracking-wider text-neutral-400">
          {player.ageGroup}
        </span>

        {/* Rating & Indicator */}
        <div className="hidden sm:flex col-span-3 items-center justify-end gap-3">
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-light tracking-tight font-mono">
                {player.percentile?.toFixed(1) ?? '0.0'}
              </span>
              <span className="text-[9px] font-mono text-neutral-400">
                PR
              </span>
            </div>
            
            <div
              className={`w-10 h-[2px] mt-0.5 overflow-hidden ${
                isKeyboardFocused ? 'bg-neutral-800' : 'bg-neutral-200'
              }`}
            >
              <div
                className={`h-full transition-all duration-300 ${
                  isKeyboardFocused ? 'bg-white' : 'bg-black'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, player.percentile))}%` }}
              />
            </div>
          </div>

          <span
            className={`transition-transform duration-150 text-xs ${
              isKeyboardFocused
                ? 'translate-x-1 text-white opacity-100'
                : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1 text-black'
            }`}
          >
            →
          </span>
        </div>
      </div>
    </div>
  );
}
