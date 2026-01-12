
import React, { useState } from 'react';
import { ActionTrigger } from './ActionTrigger';

interface EntryProps {
  onProcess: (links: string[]) => void;
  isProcessing: boolean;
}

export const SourceEntry: React.FC<EntryProps> = ({ onProcess, isProcessing }) => {
  const [links, setLinks] = useState<string[]>(['']);

  const updateLink = (idx: number, val: string) => {
    const updated = [...links];
    updated[idx] = val;
    setLinks(updated);
  };

  const addField = () => setLinks([...links, '']);
  
  const dropField = (idx: number) => {
    if (links.length > 1) {
      setLinks(links.filter((_, i) => i !== idx));
    }
  };

  const execute = (e: React.FormEvent) => {
    e.preventDefault();
    const active = links.filter(l => l.trim().length > 0);
    if (active.length) onProcess(active);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-4">
      <header className="text-center mb-10 space-y-3">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">Nuance</h1>
        <p className="text-slate-500 text-lg">Deconstruct media narratives. Find the consensus.</p>
      </header>

      <form onSubmit={execute} className="p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md shadow-xl">
        <div className="space-y-4 mb-6">
          {links.map((link, i) => (
            <div key={i} className="flex items-center gap-3 group">
              <input
                type="url"
                placeholder="https://news-article.com/story"
                value={link}
                onChange={(e) => updateLink(i, e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-3.5 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder:text-slate-700"
                required={i === 0}
              />
              {links.length > 1 && (
                <button
                  type="button"
                  onClick={() => dropField(i)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-rose-400 transition-all"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <footer className="flex items-center justify-between gap-4">
          <ActionTrigger type="button" mode="ghost" onClick={addField} busy={isProcessing}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>
            Add Source
          </ActionTrigger>
          
          <ActionTrigger type="submit" busy={isProcessing} disabled={!links.some(l => l.trim())}>
            Run Analysis
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 12l-18 0M15 6l6 6-6 6"></path></svg>
          </ActionTrigger>
        </footer>
      </form>
    </div>
  );
};
