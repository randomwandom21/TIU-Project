
import React, { useState } from 'react';
import { ActionTrigger } from './ActionTrigger';

interface EntryProps {
  onProcess: (links: string[]) => void;
  isProcessing: boolean;
}

const FEATURED_OUTLETS = [
  { name: 'The Hindu', domain: 'thehindu.com', url: 'https://www.thehindu.com' },
  { name: 'Hindustan Times', domain: 'hindustantimes.com', url: 'https://www.hindustantimes.com' },
  { name: 'Times of India', domain: 'timesofindia.indiatimes.com', url: 'https://timesofindia.indiatimes.com' },
  { name: 'Indian Express', domain: 'indianexpress.com', url: 'https://indianexpress.com' },
  { name: 'NDTV', domain: 'ndtv.com', url: 'https://www.ndtv.com' },
];

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
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500 dark:from-violet-400 dark:to-indigo-300 transition-all duration-300">Consensus</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Deconstruct media narratives. Find the consensus.</p>
      </header>

      <form onSubmit={execute} className="p-8 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-md shadow-xl mb-12 transition-colors">
        <div className="space-y-4 mb-6">
          {links.map((link, i) => (
            <div key={i} className="flex items-center gap-3 group">
              <input
                type="url"
                placeholder="https://news-article.com/story"
                value={link}
                onChange={(e) => updateLink(i, e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 rounded-xl px-4 py-3.5 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                required={i === 0}
              />
              {links.length > 1 && (
                <button
                  type="button"
                  onClick={() => dropField(i)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 transition-all"
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

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800/50"></div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] whitespace-nowrap">Featured Indian Outlets</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800/50"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {FEATURED_OUTLETS.map((outlet) => (
            <a
              key={outlet.name}
              href={outlet.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3.5 py-2 bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/60 rounded-full hover:border-violet-500 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all group shadow-sm"
            >
              <img 
                src={`https://logo.clearbit.com/${outlet.domain}`} 
                alt={outlet.name}
                className="w-5 h-5 rounded-full filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(outlet.name)}&background=1e293b&color=94a3b8`;
                }}
              />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                {outlet.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
