import React from 'react';
import { PerspectiveSummary } from '../types';

interface SummaryProps {
  summary: PerspectiveSummary;
}

export const Summary: React.FC<SummaryProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h4 className="text-emerald-400 font-medium mb-3 text-sm uppercase tracking-wider">Agreements</h4>
        <ul className="list-disc list-inside space-y-2 text-sm text-zinc-400">
          {summary.areas_of_agreement.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h4 className="text-amber-400 font-medium mb-3 text-sm uppercase tracking-wider">Disagreements</h4>
        <ul className="list-disc list-inside space-y-2 text-sm text-zinc-400">
          {summary.areas_of_disagreement.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h4 className="text-indigo-400 font-medium mb-3 text-sm uppercase tracking-wider">Meta Observations</h4>
        <ul className="list-disc list-inside space-y-2 text-sm text-zinc-400">
          {summary.meta_observations.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};