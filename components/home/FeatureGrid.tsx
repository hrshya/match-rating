


export function FeatureGrid() {
  return (
    <section className="space-y-6 pt-4">
      <div className="border-b border-black pb-2">
        <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
          CORE SYSTEM ARCHITECTURE
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-neutral-200 p-6 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 block">
            01 / INGESTION
          </span>
          <h3 className="text-lg font-light text-black">CSV Match Processing</h3>
          <p className="text-xs text-neutral-500 font-sans leading-relaxed">
            Seamless drag-and-drop ingestion of standard match event exports with built-in schema validation and parsing.
          </p>
        </div>

        <div className="bg-white border border-neutral-200 p-6 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 block">
            02 / ANALYTICS
          </span>
          <h3 className="text-lg font-light text-black">Percentile Rating Calculation</h3>
          <p className="text-xs text-neutral-500 font-sans leading-relaxed">
            Automatic normalization across age groups (U17, U19, Senior) to generate fair, cohort-adjusted scout benchmarks.
          </p>
        </div>

        <div className="bg-white border border-neutral-200 p-6 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 block">
            03 / DOSSIERS
          </span>
          <h3 className="text-lg font-light text-black">Editorial Player Profiles</h3>
          <p className="text-xs text-neutral-500 font-sans leading-relaxed">
            High-density athlete dossiers detailing minutes, passes, touches, and chronologically indexed match performance logs.
          </p>
        </div>
      </div>
    </section>
  );
}
