
import React from 'react';
import { GroundTruth } from '../definitions';

interface TruthProps {
  data: GroundTruth[];
}

export const GroundTruthView: React.FC<TruthProps> = ({ data }) => {
  return (
    <section className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-7 shadow-sm transition-colors">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-violet-500/10 rounded-xl border border-violet-500/20">
          <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Baseline Facts</h2>
      </div>
      
      <div className="space-y-4">
        {data.map((item) => (
          <article key={item.index} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40 hover:bg-white dark:hover:bg-slate-900/50 transition-all duration-300 shadow-sm dark:shadow-none">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 mt-1 select-none">#{item.index}</span>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{item.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
