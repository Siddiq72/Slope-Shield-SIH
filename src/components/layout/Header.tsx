import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  PlusCircle, 
  Sparkles,
  RefreshCw,
  Layers,
  MapPin
} from 'lucide-react';
import { useDemo, DEMO_SCENARIOS } from '../../context/DemoContext';
import { Button } from '../ui/Button';

interface HeaderProps {
  onOpenReportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenReportModal }) => {
  const { 
    demoStage, 
    demoStageTitle, 
    isAutoPlaying, 
    toggleAutoPlay, 
    nextDemoStage, 
    prevDemoStage, 
    setDemoStage, 
    resetToBaseline,
    activeScenarioId,
    setScenario,
    audioWarningMuted,
    toggleAudioWarning,
    alerts,
    apiSource,
    isApiLoading,
    refreshBackendData
  } = useDemo();

  const [showScenarioMenu, setShowScenarioMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;

  return (
    <header className="h-16 border-b border-[#18283E] bg-[#07111F]/90 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between gap-3 sm:gap-6 sticky top-0 z-20 select-none shadow-md">
      {/* Left: Intelligence Title & Scenario Picker */}
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex flex-col justify-center">
            <h1 className="text-xs lg:text-sm font-bold text-slate-100 font-sans tracking-wide uppercase leading-tight flex items-center gap-1.5">
              <span>DISASTER INTELLIGENCE</span>
              <span className="text-cyan-400">COMMAND</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono-tech leading-tight">
              PS 26001 | NEXORA Operations
            </p>
          </div>

          <div className="h-7 px-2.5 rounded bg-[#0E1D32] border border-[#1c2e47] flex items-center gap-1.5 text-[11px] font-mono-tech font-bold text-cyan-300 shadow-sm">
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>26.0°N, 92.5°E</span>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-6 w-px bg-[#18283E]" />

        {/* Scenario Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowScenarioMenu(!showScenarioMenu)}
            className="flex items-center gap-2 px-3 rounded-lg bg-[#0E1D32] hover:bg-[#152945] border border-[#1c2e47] hover:border-[#2b496e] text-xs font-mono-tech text-slate-200 transition-colors shadow-sm cursor-pointer h-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
            <span className="hidden md:inline font-sans text-slate-400 text-xs">Sector:</span>
            <span className="font-bold text-cyan-300 truncate max-w-[130px] text-xs">
              {DEMO_SCENARIOS.find(s => s.id === activeScenarioId)?.name.split(' ')[0] || 'Aizawl'}
            </span>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform flex-shrink-0 ${showScenarioMenu ? 'rotate-90' : ''}`} />
          </button>

          {showScenarioMenu && (
            <div className="absolute left-0 top-full mt-2 w-72 bg-[#0B1728] border border-[#203550] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 text-[10px] font-mono-tech text-slate-400 uppercase tracking-wider border-b border-[#18283E] mb-1">
                Select Demonstration Sector
              </div>
              {DEMO_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    setScenario(sc.id);
                    setShowScenarioMenu(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-colors mb-1 cursor-pointer ${
                    activeScenarioId === sc.id
                      ? 'bg-[#0E1D32] text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'text-slate-300 hover:bg-[#0E1D32]/70 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs">{sc.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono-tech">{sc.location}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Interactive Demo Progression Controller */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 bg-[#040810] border border-[#18283E] px-2.5 py-1 rounded-lg shadow-inner flex-shrink-0">
        <div className="hidden xl:flex flex-col text-right mr-2">
          <span className="text-[9px] uppercase font-mono-tech text-slate-400 tracking-wider font-bold">
            ESCALATION TIMELINE
          </span>
          <span className="text-[11px] font-mono-tech text-teal-300 font-bold truncate max-w-[180px]">
            {demoStageTitle.split(':')[0]}
          </span>
        </div>

        {/* Stage step indicators */}
        <div className="flex items-center gap-1">
          {([1, 2, 3, 4, 5] as const).map((stage) => {
            const isCurrent = demoStage === stage;
            const isPassed = demoStage >= stage;
            return (
              <button
                key={stage}
                onClick={() => setDemoStage(stage)}
                title={`Jump to Stage ${stage}`}
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center font-mono-tech text-[10px] font-extrabold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-rose-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.7)] scale-105'
                    : isPassed
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                    : 'bg-[#0E1D32] text-slate-400 border border-[#18283E] hover:text-slate-200'
                }`}
              >
                {stage}
              </button>
            );
          })}
        </div>

        <div className="h-4 w-px bg-[#18283E] mx-0.5" />

        {/* Previous / Next buttons */}
        <button
          onClick={prevDemoStage}
          title="Previous Stage"
          className="p-1 rounded hover:bg-[#0E1D32] text-slate-400 hover:text-white cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={toggleAutoPlay}
          title={isAutoPlaying ? 'Pause Simulation' : 'Auto Play Simulation'}
          className={`px-2 py-1 rounded flex items-center gap-1 font-mono-tech text-xs transition-colors cursor-pointer ${
            isAutoPlaying
              ? 'bg-rose-950/70 text-rose-300 border border-rose-500/50 shadow-[0_0_8px_rgba(239,68,68,0.3)]'
              : 'bg-[#0E1D32] text-cyan-300 border border-[#1c2e47] hover:bg-[#152945]'
          }`}
        >
          {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span className="hidden md:inline text-[10px] font-bold">{isAutoPlaying ? 'PAUSE' : 'STEP'}</span>
        </button>

        <button
          onClick={nextDemoStage}
          title="Next Escalation Stage"
          className="p-1 rounded hover:bg-[#0E1D32] text-slate-400 hover:text-white cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={resetToBaseline}
          title="Reset to Normal Baseline (Stage 1)"
          className="p-1 rounded hover:bg-[#0E1D32] text-slate-400 hover:text-slate-200 ml-0.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Uplink Status, API Connection Badge, Audio Toggle, and Field Action */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Backend API Connection Indicator */}
        <button
          onClick={() => refreshBackendData()}
          title="Click to refresh REST API data from server"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B1728] border border-[#18283E] hover:border-[#203550] text-xs font-mono-tech transition-colors cursor-pointer shadow-sm"
        >
          <span className={`w-2 h-2 rounded-full ${apiSource === 'BACKEND_API' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-slate-300 text-[11px] font-semibold">
            {isApiLoading ? 'SYNCING...' : apiSource === 'BACKEND_API' ? 'REST API' : 'FALLBACK DATA'}
          </span>
          <RefreshCw className={`w-3 h-3 text-slate-400 ${isApiLoading ? 'animate-spin' : ''}`} />
        </button>

        <div className="hidden lg:block text-right">
          <div className="text-xs text-slate-300 font-mono-tech font-bold tracking-wider">{currentTime || '12:00:00'} IST</div>
          <div className="text-[10px] text-cyan-400 font-mono-tech tracking-widest font-semibold">SECURE UPLINK</div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Siren Warning Toggle */}
          <button
            onClick={toggleAudioWarning}
            title={audioWarningMuted ? 'Unmute siren warning audio' : 'Mute siren warning audio'}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              audioWarningMuted 
                ? 'bg-[#0E1D32] border-[#18283E] text-slate-400 hover:text-slate-200' 
                : 'bg-cyan-950 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(0,212,255,0.3)]'
            }`}
          >
            {audioWarningMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* 1-Tap Field Upload Button */}
          <Button
            onClick={onOpenReportModal}
            variant="primary"
            size="sm"
            icon={<PlusCircle className="w-4 h-4" />}
            className="font-bold tracking-wide"
          >
            <span className="hidden sm:inline">1-Tap</span> Field Report
          </Button>
        </div>
      </div>
    </header>
  );
};
