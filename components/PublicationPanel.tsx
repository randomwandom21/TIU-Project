
import React from 'react';
import { NewsSource, GroundTruth } from '../definitions';

interface PanelProps {
  source: NewsSource;
  baseline: GroundTruth[];
}

export const PublicationPanel: React.FC<PanelProps> = ({ source, baseline }) => {
  const alignmentThemes = (label: string) => {
    const txt = label.toLowerCase();
    if (txt.includes('left')) return 'text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900/30 bg-sky-50 dark:bg-sky-950/20';
    if (txt.includes('right')) return 'text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-950/20';
    return 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/20';
  };

  return (
    <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 min-w-[360px] max-w-[420px] flex flex-col gap-5 snap-start shadow-md dark:shadow-inner transition-colors">
      <div className="flex flex-col gap-2 pb-5 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-50">{source.publisher}</h3>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border tracking-tighter ${alignmentThemes(source.political_alignment)}`}>
            {source.political_alignment}
          </span>
        </div>
        <a href={source.source_url} target="_blank" className="text-xs text-slate-400 dark:text-slate-500 hover:underline hover:text-slate-600 dark:hover:text-slate-300 truncate transition-colors">
          {source.source_url}
        </a>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
        {source.narratives.map((map, i) => {
          const original = baseline.find(b => b.index === map.fact_id);
          return (
            <div key={i} className="bg-slate-50 dark:bg-slate-950/60 p-5 rounded-xl border border-slate-100 dark:border-slate-800/40 shadow-sm">
              <header className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-500 bg-white dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800">
                  REF FACT #{map.fact_id}
                </span>
              </header>
              
              {original && (
                 <blockquote className="mb-3 text-[11px] text-slate-400 dark:text-slate-600 border-l-2 border-slate-200 dark:border-slate-800/50 pl-3 leading-tight italic">
                    "{original.content.length > 60 ? original.content.slice(0, 57) + '...' : original.content}"
                 </blockquote>
              )}

              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 font-medium leading-relaxed">{map.framing_narrative}</p>
              
              {map.pivotal_terms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {map.pivotal_terms.map((word, j) => (
                    <span key={j} className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900/80 text-[10px] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800/60">
                      "{word}"
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
