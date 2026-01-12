
import React from 'react';
import { EditorialSynthesis } from '../definitions';

interface SynopticProps {
  summary: EditorialSynthesis;
}

export const SynopticOverview: React.FC<SynopticProps> = ({ summary }) => {
  const sections = [
    { title: 'Harmonious Data', data: summary.consensus_points, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/10' },
    { title: 'Friction Points', data: summary.divergent_perspectives, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/10' },
    { title: 'Structural Notes', data: summary.analytical_meta_notes, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {sections.map((sec, idx) => (
        <div key={idx} className={`bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md dark:shadow-none hover:shadow-xl dark:hover:shadow-2xl transition-all`}>
          <h4 className={`${sec.color} font-black text-xs uppercase tracking-widest mb-5 opacity-90`}>{sec.title}</h4>
          <ul className="space-y-3">
            {sec.data.map((point, pIdx) => (
              <li key={pIdx} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed group">
                <span className={`w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mt-1.5 group-hover:scale-125 transition-transform`} />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
