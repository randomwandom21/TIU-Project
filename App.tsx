
import React, { useState } from 'react';
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-violet-500/30">
      {/* Navigation Header */}
      <nav className="h-16 border-b border-slate-900 bg-slate-950/60 backdrop-blur-xl fixed top-0 inset-x-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={restart}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <div className="w-2.5 h-2.5 bg-white rounded-sm" />
            </div>
            <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">NUANCE</span>
          </div>
          
          {insight && (
            <button 
              onClick={restart}
              className="text-xs font-bold text-slate-500 hover:text-slate-200 uppercase tracking-widest transition-colors"
            >
              Restart Session
            </button>
          )}
        </div>
      </nav>

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        {!insight ? (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SourceEntry onProcess={initiateAnalysis} isProcessing={working} />
            
            {fault && (
              <div className="mt-8 p-5 bg-rose-500/5 border border-rose-500/20 text-rose-400 rounded-2xl text-sm flex items-center gap-3">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                {fault}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-20 animate-in zoom-in-95 duration-500">
            {/* Split View: Data vs Narratives */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <aside className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                <GroundTruthView data={insight.verified_facts} />
              </aside>

              <div className="lg:col-span-8">
                <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-none">
                  {insight.publications.map((pub, idx) => (
                    <PublicationPanel key={idx} source={pub} baseline={insight.verified_facts} />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Insight Synthesis */}
            <section className="pt-16 border-t border-slate-900">
              <header className="mb-12 text-center">
                <h3 className="text-3xl font-extrabold text-slate-100 tracking-tight">Editorial Landscape</h3>
                <p className="text-slate-500 mt-2">Aggregated overview of coverage patterns</p>
              </header>
              <SynopticOverview summary={insight.synthesis} />
            </section>

            {/* Citation Metadata */}
            {refs.length > 0 && (
              <footer className="pt-10 border-t border-slate-900 flex flex-col items-center gap-6">
                <h5 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">Verification Footprints</h5>
                <div className="flex flex-wrap justify-center gap-6">
                  {refs.map((ref, i) => (
                    ref.web?.uri && (
                      <a key={i} href={ref.web.uri} target="_blank" className="text-xs text-slate-500 hover:text-violet-400 max-w-[180px] truncate transition-all">
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

      <footer className="py-12 border-t border-slate-900 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 grayscale opacity-40">
           <div className="w-2 h-2 rounded-full bg-slate-500" />
           <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Engine v2.5.0-Release</span>
        </div>
        <p className="text-slate-700 text-[10px] font-medium uppercase tracking-[0.2em]">Objective Analysis • No Noise</p>
      </footer>
    </div>
  );
};

export default VeritasApp;
