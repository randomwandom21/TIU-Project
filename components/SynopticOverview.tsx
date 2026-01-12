
import React from 'react';
import { EditorialSynthesis } from '../definitions';

interface SynopticProps {
  summary: EditorialSynthesis;
}

export const SynopticOverview: React.FC<SynopticProps> = ({ summary }) => {
  const sections = [
    { title: 'Harmonious Data', data: summary.consensus_points, color: 'text-emerald-400', bg: 'bg-emerald-950/10' },
    { title: 'Friction Points', data: summary.divergent_perspectives, color: 'text-amber-400', bg: 'bg-amber-950/10' },
    { title: 'Structural Notes', data: summary.analytical_meta_notes, color: 'text-indigo-400', bg: 'bg-indigo-950/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {sections.map((sec, idx) => (
        <div key={idx} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:shadow-2xl transition-shadow">
          <h4 className={`${sec.color} font-black text-xs uppercase tracking-widest mb-5 opacity-80`}>{sec.title}</h4>
          <ul className="space-y-3">
            {sec.data.map((point, pIdx) => (
              <li key={pIdx} className="flex gap-3 text-sm text-slate-400 leading-relaxed group">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-1.5 group-hover:scale-125 transition-transform" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
