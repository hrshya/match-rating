'use client';

import { useState } from 'react';

const samplePlayers = {
  u17: {
    name: 'Julian Vance',
    pos: 'Central Midfielder',
    ageGroup: 'U17 Elite',
    rating: 94.2,
    matches: 14,
    passPct: '88.4%',
    avgTouches: 68.5,
    tier: 'ELITE PROSPECT',
  },
  u19: {
    name: 'Mateo Rossi',
    pos: 'Winger / AM',
    ageGroup: 'U19 Academy',
    rating: 87.8,
    matches: 19,
    passPct: '81.2%',
    avgTouches: 52.1,
    tier: 'HIGH POTENTIAL',
  },
};

export function DossierPreview() {
  const [activeSample, setActiveSample] = useState<'u17' | 'u19'>('u17');
  const sample = samplePlayers[activeSample];

  return (
    <section className="border border-neutral-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 block">
            INTERACTIVE DOSSIER PREVIEW
          </span>
          <h2 className="text-lg font-light text-black">Age-Group Cohort Indexing</h2>
        </div>

        <div className="flex items-center gap-1 bg-neutral-100 p-1 font-mono text-[10px] uppercase tracking-wider">
          <button
            onClick={() => setActiveSample('u17')}
            className={`px-3 py-1.5 transition-all ${
              activeSample === 'u17' ? 'bg-black text-white font-medium' : 'text-neutral-500 hover:text-black'
            }`}
          >
            U17 Cohort
          </button>
          <button
            onClick={() => setActiveSample('u19')}
            className={`px-3 py-1.5 transition-all ${
              activeSample === 'u19' ? 'bg-black text-white font-medium' : 'text-neutral-500 hover:text-black'
            }`}
          >
            U19 Cohort
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch pt-2">
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em]">
              <span className="px-2 py-0.5 bg-black text-white font-medium">
                {sample.ageGroup}
              </span>
              <span className="text-neutral-300">•</span>
              <span className="text-neutral-500">{sample.tier}</span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-light tracking-tight text-black">
              {sample.name}
            </h3>
            <p className="text-xs font-mono text-neutral-500">{sample.pos}</p>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-neutral-500 border-t border-neutral-100 pt-4">
            <div>
              <span className="block text-[9px] uppercase tracking-widest text-neutral-400">Indexed Matches</span>
              <span className="text-black font-normal">{sample.matches} Matches</span>
            </div>
            <div className="h-6 w-px bg-neutral-200" />
            <div>
              <span className="block text-[9px] uppercase tracking-widest text-neutral-400">Pass Accuracy</span>
              <span className="text-black font-normal">{sample.passPct}</span>
            </div>
            <div className="h-6 w-px bg-neutral-200" />
            <div>
              <span className="block text-[9px] uppercase tracking-widest text-neutral-400">Avg Touches</span>
              <span className="text-black font-normal">{sample.avgTouches}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 bg-black text-white p-6 flex flex-col justify-between border border-black">
          <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
            <span>Percentile Rating</span>
            <span className="text-emerald-400 font-bold">VERIFIED</span>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-light font-mono tracking-tight leading-none">
                {sample.rating}
              </span>
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                / 100 PR
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="w-full bg-neutral-800 h-1.5 overflow-hidden rounded-full">
              <div
                className="bg-white h-full transition-all duration-500"
                style={{ width: `${sample.rating}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
              <span>Benchmarked against {sample.ageGroup}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
