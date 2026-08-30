import React from 'react';
import { Route, AlertTriangle, CheckCircle, ShieldX, ArrowRight } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const RoadConnectivityPanel: React.FC = () => {
  const { roads, setActiveTab } = useDemo();

  const openCount = 42;
  const atRiskCount = 8;
  const blockedCount = 3;

  return (
    <div className="bg-[#0B1728] border border-[#1c2e47] rounded-xl p-5 shadow-xl flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#18283E]">
          <div className="flex items-center gap-2">
            <Route className="w-4 h-4 text-amber-400" />
            <div>
              <h3 className="text-xs font-bold text-slate-100 font-sans uppercase tracking-widest font-mono-tech">
                ROAD CONNECTIVITY
              </h3>
              <p className="text-[11px] font-mono-tech text-slate-400">
                Arterial Highway Corridors & Lifelines
              </p>
            </div>
          </div>

          <span className="text-xs font-mono-tech font-bold text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
            53 ARTERIALS
          </span>
        </div>

        {/* 3 Summary Pills: 42 OPEN, 08 AT RISK, 03 BLOCKED */}
        <div className="grid grid-cols-3 gap-3 my-3">
          <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-center">
            <span className="text-[10px] font-mono-tech uppercase text-slate-400 block font-semibold">OPEN</span>
            <div className="text-2xl font-extrabold font-mono-tech text-emerald-400 mt-0.5">{openCount}</div>
          </div>

          <div className="p-3 rounded-lg bg-orange-950/30 border border-orange-500/30 text-center">
            <span className="text-[10px] font-mono-tech uppercase text-slate-400 block font-semibold">AT RISK</span>
            <div className="text-2xl font-extrabold font-mono-tech text-orange-400 mt-0.5">{atRiskCount}</div>
          </div>

          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-center shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            <span className="text-[10px] font-mono-tech uppercase text-slate-400 block font-semibold">BLOCKED</span>
            <div className="text-2xl font-extrabold font-mono-tech text-rose-400 mt-0.5 animate-pulse">{blockedCount}</div>
          </div>
        </div>

        {/* Key Corridors List */}
        <div className="space-y-2 mt-2">
          {roads.slice(0, 3).map((road) => {
            const isBlocked = road.status === 'BLOCKED';
            const isAtRisk = road.status === 'AT RISK';
            return (
              <div
                key={road.id}
                className="p-2.5 rounded-lg bg-[#07111F]/90 border border-[#18283E] flex items-center justify-between text-xs font-sans"
              >
                <div className="truncate pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold font-mono-tech text-slate-100">{road.highwayCode}</span>
                    <span className="text-slate-400 truncate text-[11px]">— {road.name}</span>
                  </div>
                  <span className="text-[10px] font-mono-tech text-slate-400 truncate block">
                    {road.criticalSection}
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded font-mono-tech text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                    isBlocked
                      ? 'bg-rose-950/70 text-rose-400 border border-rose-500/50 animate-pulse'
                      : isAtRisk
                      ? 'bg-orange-950/70 text-orange-400 border border-orange-500/50'
                      : 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/50'
                  }`}
                >
                  {road.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-[#18283E] flex items-center justify-between text-[11px] font-mono-tech text-slate-400">
        <span>PWD & BRO Corridor Relays</span>
        <button
          onClick={() => setActiveTab('emergency')}
          className="text-cyan-300 hover:underline flex items-center gap-0.5 font-semibold cursor-pointer"
        >
          <span>DETOURS</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
