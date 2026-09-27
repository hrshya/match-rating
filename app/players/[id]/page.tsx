'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { PlayerDetail } from '@/types';

export default function PlayerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [player, setPlayer] = useState<PlayerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerDetail = async () => {
      try {
        const response = await axios.get(`/api/players/${params.id}`);
        setPlayer(response.data.player);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to sync player record');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPlayerDetail();
    }
  }, [params.id]);

  // Derived Performance Metrics
  const stats = useMemo(() => {
    if (!player?.appearances?.length) return null;

    const totalMins = player.appearances.reduce((acc, a) => acc + a.minutesPlayed, 0);
    const totalTouches = player.appearances.reduce((acc, a) => acc + a.touches, 0);
    const passesComp = player.appearances.reduce((acc, a) => acc + a.passesCompleted, 0);
    const passesAtt = player.appearances.reduce((acc, a) => acc + a.passesAttempted, 0);
    const passPct = passesAtt > 0 ? ((passesComp / passesAtt) * 100).toFixed(1) : '0.0';
    const shots = player.appearances.reduce((acc, a) => acc + a.shots, 0);
    const shotsOnTarget = player.appearances.reduce((acc, a) => acc + (a.shotsOnTarget || 0), 0);
    const tackles = player.appearances.reduce((acc, a) => acc + a.tackles, 0);
    const interceptions = player.appearances.reduce((acc, a) => acc + (a.interceptions || 0), 0);

    return {
      totalMins,
      totalTouches,
      passesComp,
      passesAtt,
      passPct,
      shots,
      shotsOnTarget,
      defensiveActions: tackles + interceptions,
      avgTouchesPerMatch: (totalTouches / player.appearances.length).toFixed(1),
    };
  }, [player]);

  // Rating Tier Identifier
  const getRatingTier = (rating: number) => {
    if (rating >= 90) return 'ELITE PROSPECT';
    if (rating >= 75) return 'HIGH POTENTIAL';
    if (rating >= 50) return 'CORE TIER';
    return 'DEVELOPMENTAL';
  };

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'b' || e.key === 'B') {
        if (
          document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA'
        ) {
          router.push('/players');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-6 font-sans antialiased">
        <div className="space-y-3 text-center">
          <div className="w-2.5 h-2.5 rounded-full bg-black animate-ping mx-auto" />
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
            COMPILING DOSSIER...
          </p>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-6 text-black font-sans antialiased">
        <div className="max-w-xs w-full border-l-2 border-red-600 pl-4 py-2 space-y-3 bg-white p-6 border border-neutral-200 shadow-xs">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-600">
            SYNC failure / 404
          </p>
          <p className="text-xs text-neutral-600 font-mono leading-relaxed">
            {error || 'Player profile record not found'}
          </p>
          <Link
            href="/players"
            className="inline-block text-[10px] font-mono uppercase tracking-widest text-black underline hover:text-neutral-500 transition-colors"
          >
            ← Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-black selection:bg-black selection:text-white pb-36 font-sans antialiased">
      <div className="max-w-4xl mx-auto px-6 pt-12 sm:pt-20 space-y-10">
        
        {/* Top Navigation & Status Bar */}
        <header className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3 text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
            <Link
              href="/players"
              className="flex items-center gap-2 text-black hover:text-neutral-500 transition-colors group"
            >
              <span className="transition-transform duration-150 group-hover:-translate-x-1">←</span>
              <span className="font-medium">Directory</span>
            </Link>
            <div className="flex items-center gap-4">
              <span>DOSSIER / #{player.id.slice(0, 6)}</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">
                {player.appearances.length} {player.appearances.length === 1 ? 'MATCH' : 'MATCHES'} INDEXED
              </span>
            </div>
          </div>

          {/* Editorial Athlete Profile Hero */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch pt-2">
            
            {/* Athlete Identity Block */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em]">
                  <span className="px-2 py-0.5 bg-black text-white font-medium">
                    {player.ageGroup}
                  </span>
                  <span className="text-neutral-300">•</span>
                  <span className="text-neutral-500">{getRatingTier(player.percentile)}</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-black leading-none pt-1">
                  {player.name}
                </h1>
              </div>

              <div className="flex items-center gap-6 text-xs font-mono text-neutral-500 border-t border-neutral-200 pt-4">
                <div>
                  <span className="block text-[9px] uppercase tracking-widest text-neutral-400">Total Playtime</span>
                  <span className="text-black font-normal">{stats?.totalMins ?? 0} Mins</span>
                </div>
                <div className="h-6 w-px bg-neutral-200" />
                <div>
                  <span className="block text-[9px] uppercase tracking-widest text-neutral-400">Avg Touches</span>
                  <span className="text-black font-normal">{stats?.avgTouchesPerMatch ?? 0} / Match</span>
                </div>
              </div>
            </div>

            {/* High-Contrast Percentile Rating Tile */}
            <div className="md:col-span-5 bg-black text-white p-6 flex flex-col justify-between border border-black shadow-md relative overflow-hidden">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 z-10">
                <span>Percentile Rating</span>
                <span className="text-emerald-400 font-bold">VERIFIED</span>
              </div>

              <div className="my-4 z-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-light font-mono tracking-tight leading-none">
                    {player.percentile?.toFixed(1) ?? '0.0'}
                  </span>
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                    / 100 PR
                  </span>
                </div>
              </div>

              {/* Visual Percentile Progress Track */}
              <div className="space-y-1.5 z-10">
                <div className="w-full bg-neutral-800 h-1.5 overflow-hidden rounded-full">
                  <div
                    className="bg-white h-full transition-all duration-700 ease-out"
                    style={{ width: `${Math.min(100, Math.max(0, player.percentile))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                  <span>0%</span>
                  <span>Bench: {player.ageGroup} Cohort</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* Essential Efficiency Metrics Ribbon */}
        {stats && (
          <section className="space-y-3">
            <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
              Aggregated Key Performance Indicators
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white border border-neutral-200 p-4 space-y-1">
                <span className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400">Pass Accuracy</span>
                <span className="text-2xl font-mono font-light text-black">{stats.passPct}%</span>
                <span className="block text-[9px] font-mono text-neutral-400">{stats.passesComp} / {stats.passesAtt} Att.</span>
              </div>

              <div className="bg-white border border-neutral-200 p-4 space-y-1">
                <span className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400">Total Touches</span>
                <span className="text-2xl font-mono font-light text-black">{stats.totalTouches}</span>
                <span className="block text-[9px] font-mono text-neutral-400">Across {player.appearances.length} matches</span>
              </div>

              <div className="bg-white border border-neutral-200 p-4 space-y-1">
                <span className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400">Shots (Target)</span>
                <span className="text-2xl font-mono font-light text-black">{stats.shots}</span>
                <span className="block text-[9px] font-mono text-neutral-400">{stats.shotsOnTarget} On Target</span>
              </div>

              <div className="bg-white border border-neutral-200 p-4 space-y-1">
                <span className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400">Defensive Actions</span>
                <span className="text-2xl font-mono font-light text-black">{stats.defensiveActions}</span>
                <span className="block text-[9px] font-mono text-neutral-400">Tackles & Interceptions</span>
              </div>
            </div>
          </section>
        )}

        {/* Detailed Match History Table */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-black pb-2">
            <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
              Indexed Match Log
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              CHRONOLOGICAL ORDER
            </span>
          </div>

          <div className="border border-neutral-200 bg-white overflow-hidden shadow-xs">
            {player.appearances.length === 0 ? (
              <div className="p-12 text-center text-xs font-mono text-neutral-400 uppercase tracking-wider">
                No individual match appearances recorded for this athlete.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 bg-neutral-50/80">
                      <th className="py-3 px-4 font-normal">Date</th>
                      <th className="py-3 px-4 font-normal">Opponent</th>
                      <th className="py-3 px-4 font-normal text-center">Pos</th>
                      <th className="py-3 px-4 font-normal text-right">Mins</th>
                      <th className="py-3 px-4 font-normal text-right">Passes</th>
                      <th className="py-3 px-4 font-normal text-right">Pass %</th>
                      <th className="py-3 px-4 font-normal text-right">Touches</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 font-mono">
                    {player.appearances.map((app) => {
                      const passRatio = app.passesAttempted > 0 
                        ? Math.round((app.passesCompleted / app.passesAttempted) * 100) 
                        : 0;

                      return (
                        <tr key={app.id} className="hover:bg-neutral-100/60 transition-colors">
                          <td className="py-3.5 px-4 text-neutral-400 text-[11px] whitespace-nowrap">
                            {new Date(app.match.matchDate).toLocaleDateString(undefined, {
                              year: '2-digit',
                              month: '2-digit',
                              day: '2-digit',
                            })}
                          </td>
                          <td className="py-3.5 px-4 font-sans font-normal text-sm text-black whitespace-nowrap">
                            {app.opponent}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-block px-1.5 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] font-mono uppercase rounded-sm border border-neutral-200">
                              {app.position}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right text-black font-normal">
                            {app.minutesPlayed}'
                          </td>
                          <td className="py-3.5 px-4 text-right text-neutral-500 text-[11px]">
                            {app.passesCompleted} / {app.passesAttempted}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className={`text-[11px] font-medium ${passRatio >= 80 ? 'text-emerald-600' : 'text-neutral-700'}`}>
                              {passRatio}%
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right text-black font-medium">
                            {app.touches}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Floating Command HUD Dock */}
        <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/95 text-white text-[10px] font-mono px-5 py-2.5 rounded-full shadow-2xl hidden sm:flex items-center gap-4 border border-neutral-800/80 backdrop-blur-md z-50">
          <button
            onClick={() => router.push('/players')}
            className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors"
          >
            <kbd className="bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 rounded text-[9px] text-white">ESC</kbd>
            <span>/</span>
            <kbd className="bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 rounded text-[9px] text-white">B</kbd> DIRECTORY
          </button>
          <span className="text-neutral-700">•</span>
          <span className="text-neutral-400 uppercase tracking-widest">
            PROSPECT DOSSIER
          </span>
        </footer>

      </div>
    </div>
  );
}