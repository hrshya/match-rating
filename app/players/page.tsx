'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Player } from '@/types';
import { DirectoryHeader } from '@/components/directory/DirectoryHeader';
import { DirectoryControls } from '@/components/directory/DirectoryControls';
import { PlayerRow } from '@/components/directory/PlayerRow';
import { DirectoryDock } from '@/components/directory/DirectoryDock';

export default function PlayersListPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('/api/players');
        setPlayers(response.data.players || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Database synchronization failure');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const ageGroups = useMemo(() => {
    const groups = new Set(players.map((p) => p.ageGroup).filter(Boolean));
    return Array.from(groups).sort();
  }, [players]);

  const filteredAndSortedPlayers = useMemo(() => {
    let result = [...players];

    if (selectedAgeGroup !== 'all') {
      result = result.filter((p) => p.ageGroup === selectedAgeGroup);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((player) => player.player.name.toLowerCase().includes(q));
    }

    result.sort((a, b) =>
      sortOrder === 'desc' ? b.percentile - a.percentile : a.percentile - b.percentile
    );
    return result;
  }, [players, searchQuery, sortOrder, selectedAgeGroup]);

  useEffect(() => {
    setFocusedIndex(-1);
  }, [searchQuery, selectedAgeGroup, sortOrder]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || (e.metaKey && e.key === 'k')) &&
        document.activeElement !== searchInputRef.current
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if (e.key === 'Escape') {
        if (document.activeElement === searchInputRef.current) {
          searchInputRef.current?.blur();
        } else {
          setSearchQuery('');
          setSelectedAgeGroup('all');
        }
        return;
      }

      if (document.activeElement === searchInputRef.current && e.key === 'ArrowDown') {
        if (filteredAndSortedPlayers.length > 0) {
          searchInputRef.current?.blur();
          setFocusedIndex(0);
        }
        return;
      }

      if (document.activeElement !== searchInputRef.current && filteredAndSortedPlayers.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setFocusedIndex((prev) => (prev < filteredAndSortedPlayers.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredAndSortedPlayers.length - 1));
        } else if (e.key === 'Enter' && focusedIndex >= 0) {
          e.preventDefault();
          const target = filteredAndSortedPlayers[focusedIndex];
          if (target) {
            router.push(`/players/${target.playerId}`);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredAndSortedPlayers, focusedIndex, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-6 text-black font-sans antialiased">
        <div className="max-w-xs w-full border-l-2 border-black pl-4 py-2 space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-600">Sync Error / 500</p>
          <p className="text-xs text-neutral-600 font-mono leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-black selection:bg-black selection:text-white pb-36 font-sans antialiased">
      <div className="max-w-3xl mx-auto px-6 pt-16 sm:pt-24 space-y-10">
        
        <DirectoryHeader
          isLoading={isLoading}
          recordCount={filteredAndSortedPlayers.length}
          ageGroups={ageGroups}
          selectedAgeGroup={selectedAgeGroup}
          onSelectAgeGroup={setSelectedAgeGroup}
        />

        <DirectoryControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery('')}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          searchInputRef={searchInputRef}
        />

        {/* Table Column Labels */}
        <div className="hidden sm:grid grid-cols-12 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 px-3 pb-2 border-b border-neutral-200">
          <span className="col-span-1">No.</span>
          <span className="col-span-6">Athlete</span>
          <span className="col-span-2 text-center">Age Group</span>
          <span className="col-span-3 text-right">Percentile</span>
        </div>

        {/* Directory List Container */}
        <div>
          {isLoading ? (
            <div className="divide-y divide-neutral-200 border-b border-neutral-200">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="py-4 px-3 flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-6">
                    <div className="h-3 w-4 bg-neutral-200" />
                    <div className="h-5 w-44 bg-neutral-200" />
                  </div>
                  <div className="h-5 w-12 bg-neutral-200" />
                </div>
              ))}
            </div>
          ) : filteredAndSortedPlayers.length === 0 ? (
            <div className="py-20 text-center space-y-3 border-y border-neutral-200 bg-white/40">
              <p className="text-neutral-400 font-mono text-xs uppercase tracking-widest">
                No indexed records match criteria
              </p>
              {(searchQuery || selectedAgeGroup !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedAgeGroup('all');
                  }}
                  className="text-[10px] font-mono uppercase tracking-widest text-black underline hover:text-neutral-500 transition-colors"
                >
                  Reset all filters
                </button>
              )}
            </div>
          ) : (
            <div className="border-b border-neutral-200 divide-y divide-neutral-200">
              {filteredAndSortedPlayers.map((player, index) => (
                <PlayerRow
                  key={player.playerId}
                  player={player}
                  index={index}
                  isKeyboardFocused={focusedIndex === index}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onClick={() => router.push(`/players/${player.playerId}`)}
                />
              ))}
            </div>
          )}
        </div>

        <DirectoryDock />

      </div>
    </div>
  );
}
