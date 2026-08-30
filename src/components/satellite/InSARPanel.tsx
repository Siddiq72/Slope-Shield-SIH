import React from 'react';
import { Satellite, Globe, Layers, CheckCircle2, ArrowDownRight, Compass } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { TechBadge } from '../ui/Badge';

export const InSARPanel: React.FC = () => {
  const { satellite } = useDemo();

  return (
    <div className="bg-[#0B1728] border border-[#1c2e47] rounded-xl p-5 shadow-xl flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#18283E]">
          <div className="flex items-center gap-2">
            <Satellite className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-widest font-mono-tech">
              SATELLITE InSAR
            </h3>
          </div>

          <span className="text-[10px] font-mono-tech text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">
            UPLINK 100%
          </span>
        </div>

        {/* Hero Surface Motion Block */}
        <div className="my-3 p-3.5 rounded-lg bg-[#07111F]/90 border border-[#18283E] flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono-tech uppercase text-slate-400 tracking-wider block font-semibold">
              SURFACE MOTION (LINE-OF-SIGHT)
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-bold font-mono-tech text-violet-300 tracking-tight">
                +{satellite.surfaceMotionMm}
              </span>
              <span className="text-[10px] font-mono-tech text-slate-400 uppercase font-semibold">
                mm
              </span>
            </div>
            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold font-mono-tech px-2 py-0.5 rounded bg-rose-950/50 text-rose-400 border border-rose-500/30">
              <ArrowDownRight className="w-3 h-3" />
              {satellite.displacementStatus}
            </span>
          </div>

          <div className="text-right space-y-1 text-xs font-mono-tech">
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">OBSERVATION</span>
              <span className="font-bold text-slate-200">{satellite.observationPeriodDays} DAYS</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">CONSTELLATION</span>
              <span className="font-bold text-cyan-300">SENTINEL-1</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">RADAR</span>
              <span className="font-bold text-slate-200">C-BAND SAR</span>
            </div>
          </div>
        </div>

        {/* Radar Pass & Coherence */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech mb-3">
          <div className="p-2.5 rounded-lg bg-[#07111F]/90 border border-[#18283E]">
            <span className="text-slate-400 block text-[9px] font-semibold">RADAR PASS TYPE</span>
            <span className="font-semibold text-slate-200 text-[11px]">{satellite.passType}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#07111F]/90 border border-[#18283E]">
            <span className="text-slate-400 block text-[9px] font-semibold">COHERENCE SCORE</span>
            <span className="font-semibold text-teal-300 text-[11px]">γ = {satellite.coherenceScore} (High)</span>
          </div>
        </div>

        {/* Signal Processing Bar */}
        <div className="p-2.5 rounded-lg bg-[#07111F]/90 border border-[#18283E]">
          <div className="flex justify-between text-[9px] font-mono-tech text-slate-400 mb-1 font-semibold">
            <span>SAR INTERFEROMETRY RESOLUTION</span>
            <span className="text-cyan-300">10m GRID</span>
          </div>
          <div className="w-full bg-[#0E1D32] h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full w-[92%] shadow-[0_0_8px_#00D4FF]"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-[#18283E] flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
        <span>Sentinel-1 Synthetic Aperture Radar</span>
        <span className="text-violet-300 font-semibold">ISRO-ESA Uplink</span>
      </div>
    </div>
  );
};
