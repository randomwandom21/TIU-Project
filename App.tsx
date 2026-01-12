
import React, { useState, useEffect } from 'react';
import { SourceEntry } from './components/SourceEntry';
import { GroundTruthView } from './components/GroundTruthView';
import { PublicationPanel } from './components/PublicationPanel';
import { SynopticOverview } from './components/SynopticOverview';
import { MediaInsight } from './definitions';
import { performCoverageAudit } from './logic/ai_engine';

const VeritasApp: React.FC = () => {
  const [insight, setInsight] = useState<MediaInsight | null>(null);
  const [working, setWorking] = useState(false);
  const [fault, setFault] = useState<string | null>(null);
  const [refs, setRefs] = useState<any[]>([]);
  
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const initiateAnalysis = async (urls: string[]) => {
    setWorking(true);
    setFault(null);
    setInsight(null);
    setRefs([]);

    try {
      const { report, citations } = await performCoverageAudit(urls);
      setInsight(report);
      setRefs(citations);
    } catch (e: any) {
      setFault(e.message || "Engine failure detected during audit.");
    } finally {
      setWorking(false);
    }
  };

  const restart = () => {
    setInsight(null);
    setFault(null);
    setRefs([]);
  };

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors duration-300 selection:bg-violet-500/30">
      {/* Navigation Header */}
      <nav className="h-16 border-b border-slate-200 dark:border-slate-900 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl fixed top-0 inset-x-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={restart}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <div className="w-2.5 h-2.5 bg-white rounded-sm" />
            </div>
            <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-slate-100 dark:to-slate-400">CONSENSUS</span>
          </div>
          
          <div className="flex items-center gap-4">
            {insight && (
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg transition-all"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Export Report
              </button>
            )}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-900 transition-colors text-slate-600 dark:text-slate-400 no-print"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"></path></svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path></svg>
              )}
            </button>
            {insight && (
              <button 
                onClick={restart}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 uppercase tracking-widest transition-colors no-print"
              >
                Restart
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        {!insight ? (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SourceEntry onProcess={initiateAnalysis} isProcessing={working} />
            
            {fault && (
              <div className="mt-8 p-5 bg-rose-500/5 dark:bg-rose-500/5 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl text-sm flex items-center gap-3">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                {fault}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-20 animate-in zoom-in-95 duration-500">
            {/* Header for Printed Copy */}
            <div className="hidden print:block text-center mb-10 border-b-2 pb-5 border-slate-900">
              <h1 className="text-4xl font-black">CONSENSUS: MEDIA AUDIT REPORT</h1>
              <p className="text-slate-600 mt-2">Generated by AI Forensic Engine • {new Date().toLocaleDateString()}</p>
            </div>

            {/* Split View: Data vs Narratives */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <aside className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                <GroundTruthView data={insight.verified_facts} />
              </aside>

              <div className="lg:col-span-8">
                <div className="flex gap-6 lg:overflow-x-auto pb-8 snap-x scrollbar-none lg:flex-nowrap flex-wrap">
                  {insight.publications.map((pub, idx) => (
                    <div key={idx} className="PublicationPanel">
                      <PublicationPanel source={pub} baseline={insight.verified_facts} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Insight Synthesis */}
            <section className="pt-16 border-t border-slate-200 dark:border-slate-900">
              <header className="mb-12 text-center">
                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Editorial Landscape</h3>
                <p className="text-slate-500 mt-2">Aggregated overview of coverage patterns</p>
              </header>
              <SynopticOverview summary={insight.synthesis} />
            </section>

            {/* Citation Metadata */}
            {refs.length > 0 && (
              <footer className="pt-10 border-t border-slate-200 dark:border-slate-900 flex flex-col items-center gap-6">
                <h5 className="text-[10px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-[0.3em]">Verification Footprints</h5>
                <div className="flex flex-wrap justify-center gap-6">
                  {refs.map((ref, i) => (
                    ref.web?.uri && (
                      <a key={i} href={ref.web.uri} target="_blank" className="text-xs text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 max-w-[180px] truncate transition-all">
                        {ref.web.title || "External Source"}
                      </a>
                    )
                  ))}
                </div>
              </footer>
            )}
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-slate-900 flex flex-col items-center gap-4 no-print">
        <div className="flex items-center gap-2 grayscale opacity-40">
           <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
           <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Engine v2.5.0-Release</span>
        </div>
        <p className="text-slate-400 dark:text-slate-700 text-[10px] font-medium uppercase tracking-[0.2em]">Objective Analysis • No Noise</p>
      </footer>
    </div>
  );
};

export default VeritasApp;
