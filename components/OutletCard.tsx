import React from 'react';
import { Outlet, Fact } from '../types';

interface OutletCardProps {
  outlet: Outlet;
  allFacts: Fact[];
}

export const OutletCard: React.FC<OutletCardProps> = ({ outlet, allFacts }) => {
  const getLeaningColor = (leaning: string) => {
    const l = leaning.toLowerCase();
    if (l.includes('left')) return 'text-blue-400 border-blue-900/30 bg-blue-950/20';
    if (l.includes('right')) return 'text-red-400 border-red-900/30 bg-red-950/20';
    return 'text-purple-400 border-purple-900/30 bg-purple-950/20';
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex-shrink-0 w-full md:w-[400px] flex flex-col gap-4 snap-center">
      <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-zinc-100">{outlet.name}</h3>
          <a href={outlet.url} target="_blank" rel="noreferrer" className="text-xs text-zinc-500 hover:text-zinc-300 truncate max-w-[200px] block mt-1">
            {outlet.url}
          </a>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium border ${getLeaningColor(outlet.claimed_leaning)}`}>
          {outlet.claimed_leaning}
        </span>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
        {outlet.interpretations.map((interp, idx) => {
          const relatedFact = allFacts.find(f => f.id === interp.fact_id);
          return (
            <div key={idx} className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-zinc-600 bg-zinc-900 px-1.5 py-0.5 rounded">
                  Re: Fact #{interp.fact_id}
                </span>
              </div>
              
              {/* Optional: Show original fact on hover or toggle, for now we assume context is clear or user looks to left col */}
              {relatedFact && (
                 <div className="mb-2 text-[10px] text-zinc-500 border-l-2 border-zinc-800 pl-2 italic">
                    "{relatedFact.statement.substring(0, 50)}..."
                 </div>
              )}

              <p className="text-sm text-zinc-300 mb-3">{interp.how_they_spin_it}</p>
              
              {interp.notable_language.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {interp.notable_language.map((phrase, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded-md bg-zinc-900 text-xs text-zinc-400 border border-zinc-800">
                      "{phrase}"
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