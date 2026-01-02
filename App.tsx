import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { InputSection } from './components/InputSection';
import { FactsDisplay } from './components/FactsDisplay';
import { OutletCard } from './components/OutletCard';
import { Summary } from './components/Summary';
import { AnalysisResult } from './types';
import { analyzeNewsUrls } from './services/geminiService';

const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groundingLinks, setGroundingLinks] = useState<any[]>([]);

  const handleAnalyze = async (urls: string[]) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setGroundingLinks([]);

    try {
      const response = await analyzeNewsUrls(urls);
      setResult(response.data);
      setGroundingLinks(response.grounding);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while analyzing the articles.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setGroundingLinks([]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Navbar / Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2" role="button" onClick={handleReset}>
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                   <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <span className="font-bold tracking-tight text-lg cursor-pointer">Consensus</span>
            </div>
            {result && (
                <button 
                  onClick={handleReset}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                    New Analysis
                </button>
            )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        {!result && (
            <div className="max-w-4xl mx-auto pt-10">
                <InputSection onAnalyze={handleAnalyze} isLoading={isLoading} />
                
                {error && (
                    <div className="mt-8 p-4 bg-red-900/20 border border-red-900/50 text-red-200 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}
            </div>
        )}

        {result && (
            <div className="space-y-12 animate-fade-in">
                {/* Top Section: Facts and Spin */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Facts (Sticky) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                        <FactsDisplay facts={result.facts} />
                    </div>

                    {/* Right Column: Outlets Horizontal Scroll/Grid */}
                    <div className="lg:col-span-8 overflow-hidden">
                        <div className="flex gap-6 overflow-x-auto pb-6 snap-x custom-scrollbar">
                            {result.outlets.map((outlet, idx) => (
                                <OutletCard key={idx} outlet={outlet} allFacts={result.facts} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Summary */}
                <div className="border-t border-zinc-800 pt-10">
                    <h3 className="text-2xl font-bold mb-6 text-center text-zinc-200">Perspective Synthesis</h3>
                    <Summary summary={result.perspective_summary} />
                </div>

                {/* Grounding Sources Footer */}
                {groundingLinks.length > 0 && (
                  <div className="mt-12 pt-6 border-t border-zinc-900 text-center">
                    <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Sources Found</p>
                    <div className="flex flex-wrap justify-center gap-4 text-xs text-zinc-500">
                      {groundingLinks.map((chunk, i) => (
                        chunk.web?.uri ? (
                          <a key={i} href={chunk.web.uri} target="_blank" rel="noreferrer" className="hover:text-indigo-400 truncate max-w-[200px] transition-colors">
                            {chunk.web.title || chunk.web.uri}
                          </a>
                        ) : null
                      ))}
                    </div>
                  </div>
                )}
            </div>
        )}
      </main>

      <footer className="py-6 text-center text-zinc-700 text-xs border-t border-zinc-900">
        <p>Powered by Gemini 2.5 • Focus on Content, Not Noise</p>
      </footer>
    </div>
  );
};

export default App;