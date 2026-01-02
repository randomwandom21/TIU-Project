import React from 'react';
import { Fact } from '../types';

interface FactsDisplayProps {
  facts: Fact[];
}

export const FactsDisplay: React.FC<FactsDisplayProps> = ({ facts }) => {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <svg className="w-5 h-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        </div>
        <h2 className="text-xl font-semibold text-zinc-100">Objective Facts</h2>
      </div>
      
      <div className="space-y-4">
        {facts.map((fact) => (
          <div key={fact.id} className="flex gap-4 p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors">
            <span className="text-xs font-mono text-zinc-500 pt-1">#{fact.id}</span>
            <p className="text-sm text-zinc-300 leading-relaxed">{fact.statement}</p>
          </div>
        ))}
      </div>
    </div>
  );
};