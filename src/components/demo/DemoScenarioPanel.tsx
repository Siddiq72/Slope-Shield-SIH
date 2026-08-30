import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Clapperboard,
  CheckCircle2,
  AlertTriangle,
  Flame,
  RefreshCw
} from 'lucide-react';
import { useDemo, DemoStage } from '../../context/DemoContext';

// Short labels shown in the stepper row
const STAGE_SHORT: Record<DemoStage, string> = {
  1: 'NORMAL',
  2: 'INCREASING RISK',
  3: 'WARNING',
  4: 'HIGH RISK',
  5: 'CRITICAL',
  6: 'RECOVERY',
};

// Brief description shown below the stage title
const STAGE_DESC: Record<DemoStage, string> = {
  1: 'Baseline telemetry nominal. Rainfall 4 mm/hr. All zones OPEN. No active alerts.',
  2: 'Moderate monsoon surge begins. Soil moisture climbing. Risk score 58 — watch N-07.',
  3: 'Heavy downpour. Subsurface saturation elevated. N-07 road corridor marked AT RISK.',
  4: 'InSAR detects -6.8 mm LOS displacement. Tilt 4.7°. DDMA teams on standby.',
  5: 'CRITICAL: Imminent shear failure. Torrential 42.5 mm/hr. Pre-emptive evacuation ordered.',
  6: 'Recovery phase: rain abating. Debris clearance underway. Residents returning under monitoring.',
};

// Colour classes per stage for the progress bar and accent
const STAGE_COLOR: Record<DemoStage, { bar: string; text: string; border: string; bg: string }> = {
  1: { bar: 'bg-cyan-500',   text: 'text-cyan-300',   border: 'border-cyan-500/40',   bg: 'bg-cyan-900/20' },
  2: { bar: 'bg-yellow-400', text: 'text-yellow-300', border: 'border-yellow-500/40', bg: 'bg-yellow-900/20' },
  3: { bar: 'bg-orange-400', text: 'text-orange-300', border: 'border-orange-500/40', bg: 'bg-orange-900/20' },
  4: { bar: 'bg-orange-500', text: 'text-orange-300', border: 'border-orange-500/50', bg: 'bg-orange-900/25' },
  5: { bar: 'bg-rose-500',   text: 'text-rose-300',   border: 'border-rose-500/50',   bg: 'bg-rose-900/25' },
  6: { bar: 'bg-teal-400',   text: 'text-teal-300',   border: 'border-teal-500/40',   bg: 'bg-teal-900/20' },
};

const STAGE_ICON: Record<DemoStage, React.ReactNode> = {
  1: <CheckCircle2 className="w-4 h-4" />,
  2: <AlertTriangle className="w-4 h-4" />,
  3: <AlertTriangle className="w-4 h-4" />,
  4: <AlertTriangle className="w-4 h-4" />,
  5: <Flame className="w-4 h-4" />,
  6: <RefreshCw className="w-4 h-4" />,
};

export const DemoScenarioPanel: React.FC = () => {
  const { demoStage, nextDemoStage, prevDemoStage, resetToBaseline } = useDemo();

  const colors = STAGE_COLOR[demoStage];
  const progressPct = ((demoStage - 1) / 5) * 100;

  return (
    <div
      className={`rounded-xl border ${colors.border} ${colors.bg} bg-[#0B1728]/80 backdrop-blur-sm shadow-lg p-4`}
      id="demo-scenario-panel"
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg bg-[#0E1D32] border ${colors.border} flex items-center justify-center ${colors.text}`}>
            <Clapperboard className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase leading-none">
              Demo Scenario Engine
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${colors.border} ${colors.text} ${colors.bg}`}>
                {STAGE_ICON[demoStage]}
                STAGE {demoStage} — {STAGE_SHORT[demoStage]}
              </span>
              <span className="text-[9px] font-mono text-slate-500 border border-slate-700 px-1.5 py-0.5 rounded">
                SIMULATED
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <button
            id="demo-prev-stage-btn"
            onClick={prevDemoStage}
            disabled={demoStage === 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0E1D32] border border-[#1c2e47] text-slate-300 hover:bg-[#142035] hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-mono transition-all"
            title="Previous stage"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Prev
          </button>

          <button
            id="demo-next-stage-btn"
            onClick={nextDemoStage}
            disabled={demoStage === 6}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all
              ${demoStage === 6
                ? 'bg-[#0E1D32] border-[#1c2e47] text-slate-500 cursor-not-allowed opacity-40'
                : `${colors.bg} ${colors.border} ${colors.text} hover:brightness-110`
              }`}
            title="Next stage"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            id="demo-reset-stage-btn"
            onClick={resetToBaseline}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0E1D32] border border-[#1c2e47] text-slate-400 hover:bg-[#142035] hover:text-cyan-300 hover:border-cyan-700/50 text-xs font-mono transition-all"
            title="Reset to Stage 1 (Normal)"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-[11px] font-mono text-slate-400 leading-relaxed mb-3 pl-0.5">
        {STAGE_DESC[demoStage]}
      </p>

      {/* Progress stepper */}
      <div className="flex items-center gap-1 mb-2.5">
        {([1, 2, 3, 4, 5, 6] as DemoStage[]).map((s) => {
          const sc = STAGE_COLOR[s];
          const active = s === demoStage;
          const done = s < demoStage;
          return (
            <div key={s} className="flex-1 flex flex-col items-center gap-0.5">
              <div
                className={`h-1.5 w-full rounded-full transition-all duration-300
                  ${done ? sc.bar : active ? sc.bar + ' opacity-80' : 'bg-slate-700/60'}`}
              />
              <span className={`text-[9px] font-mono hidden sm:block ${active ? sc.text + ' font-bold' : done ? 'text-slate-500' : 'text-slate-600'}`}>
                {STAGE_SHORT[s].split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Animated progress bar */}
      <div className="h-px w-full bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors.bar} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
};
