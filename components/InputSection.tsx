import React, { useState } from 'react';
import { Button } from './Button';

interface InputSectionProps {
  onAnalyze: (urls: string[]) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [urls, setUrls] = useState<string[]>(['']);

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  const removeUrlField = (index: number) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validUrls = urls.filter(u => u.trim() !== '');
    if (validUrls.length > 0) {
      onAnalyze(validUrls);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-white">Consensus</h1>
        <p className="text-zinc-400">Neutralize the noise. Compare coverage. Extract the truth.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 backdrop-blur-sm">
        <div className="space-y-3">
          {urls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                placeholder="Paste news article URL..."
                value={url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-zinc-600 transition-all"
                required={index === 0}
              />
              {urls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeUrlField(index)}
                  className="text-zinc-500 hover:text-red-400 p-2 transition-colors"
                  aria-label="Remove URL"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2">
          <Button type="button" variant="secondary" onClick={addUrlField} disabled={isLoading}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Another Article
          </Button>
          
          <Button type="submit" isLoading={isLoading} disabled={urls.filter(u => u.trim()).length === 0}>
            Analyze Coverage
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          </Button>
        </div>
      </form>

      {/* Example Prompts */}
      <div className="flex flex-wrap gap-2 justify-center text-xs text-zinc-500">
        <span>Try searching for coverage on:</span>
        <span className="text-indigo-400">Elections</span>
        <span>•</span>
        <span className="text-indigo-400">Market Crash</span>
        <span>•</span>
        <span className="text-indigo-400">Local Policy</span>
      </div>
    </div>
  );
};