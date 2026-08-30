import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  PlusCircle, 
  Flame, 
  Radio, 
  Sparkles,
  RefreshCw,
  BellRing,
  Server
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
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;

  return (
    <header className="h-16 border-b border-[#1e293b] bg-[#07111F]/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between gap-4 sm:gap-6 lg:gap-8 sticky top-0 z-20 select-none">
      {/* Left: Intelligence Title & Scenario Picker */}
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex flex-col justify-center">
            <h1 className="text-sm lg:text-base font-semibold text-white font-sans tracking-wide leading-tight">
              REGIONAL RISK INTELLIGENCE
            </h1>
            <p className="text-[10px] text-slate-400 font-mono leading-tight">
              PS 26001 | NEXORA Intelligence Platform
            </p>
          </div>

          <div className="h-8 px-3 rounded bg-[#101D2E] border border-[#1e293b] flex items-center justify-center text-xs font-mono font-medium text-cyan-400 shadow-sm">
            Northeast India
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-6 w-px bg-[#1e293b]" />

        {/* Scenario Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowScenarioMenu(!showScenarioMenu)}
            className="flex items-center gap-2 px-3 rounded bg-[#101D2E] hover:bg-[#142338] border border-[#1e293b] text-xs font-mono text-slate-200 transition-colors shadow-sm cursor-pointer h-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#7C5CFF] flex-shrink-0" />
            <span className="hidden md:inline font-sans text-slate-400 text-xs">Scenario:</span>
            <span className="font-semibold text-cyan-400 truncate max-w-[140px] text-xs">
              {DEMO_SCENARIOS.find(s => s.id === activeScenarioId)?.name.split(' ')[0] || 'Aizawl'}
            </span>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform flex-shrink-0 ${showScenarioMenu ? 'rotate-90' : ''}`} />
          </button>

          {showScenarioMenu && (
            <div className="absolute left-0 top-full mt-2 w-72 bg-[#0B1726] border border-[#1e293b] rounded-xl shadow-2xl p-2 z-50 animate-fade-in">
              <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-[#1e293b] mb-1">
                Select Demonstration Scenario
              </div>
              {DEMO_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    setScenario(sc.id);
                    setShowScenarioMenu(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-colors mb-1 ${
                    activeScenarioId === sc.id
                      ? 'bg-[#101D2E] text-[#00D4FF] border border-[#00D4FF]/30'
                      : 'text-slate-300 hover:bg-[#101D2E]/60 hover:text-white'
                  }`}
                >
                  <div className="font-semibold">{sc.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{sc.location}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Interactive Demo Progression Controller */}
      <div className="flex items-center gap-2 sm:gap-3 bg-[#050912] border border-[#1e293b] px-3 py-1.5 rounded shadow-inner mx-2 sm:mx-6 flex-shrink-0">
        <div className="hidden xl:flex flex-col text-right mr-2.5">
          <span className="text-[9px] uppercase font-mono text-slate-500 tracking-wider">
            DEMO SIMULATOR
          </span>
          <span className="text-[11px] font-mono text-[#14E6C5] font-semibold truncate max-w-[200px]">
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
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center font-mono text-[10px] font-bold transition-all ${
                  isCurrent
                    ? 'bg-[#EF4444] text-white shadow-[0_0_8px_#EF4444] scale-105'
                    : isPassed
                    ? 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40'
                    : 'bg-[#101D2E] text-slate-500 border border-[#1e293b] hover:text-slate-300'
                }`}
              >
                {stage}
              </button>
            );
          })}
        </div>

        <div className="h-4 w-px bg-[#1e293b] mx-1" />

        {/* Previous / Next buttons */}
        <button
          onClick={prevDemoStage}
          title="Previous Stage"
          className="p-1 rounded hover:bg-[#101D2E] text-slate-400 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={toggleAutoPlay}
          title={isAutoPlaying ? 'Pause Simulation' : 'Auto Play Simulation'}
          className={`p-1.5 rounded flex items-center gap-1 font-mono text-xs transition-colors ${
            isAutoPlaying
              ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/50'
              : 'bg-[#101D2E] text-[#00D4FF] border border-[#1e293b] hover:bg-[#142338]'
          }`}
        >
          {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={nextDemoStage}
          title="Next Escalation Stage"
          className="p-1 rounded hover:bg-[#101D2E] text-slate-400 hover:text-white"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={resetToBaseline}
          title="Reset to Normal Baseline (Stage 1)"
          className="p-1 rounded hover:bg-[#101D2E] text-slate-400 hover:text-slate-200 ml-0.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Uplink Status, API Connection Badge, Audio Toggle, and Field Action */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Backend API Connection Indicator */}
        <button
          onClick={() => refreshBackendData()}
          title="Click to refresh REST API data"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0E1A2C] border border-[#182B42] hover:border-[#264366] text-xs font-mono transition-colors"
        >
          <span className={`w-2 h-2 rounded-full ${apiSource === 'BACKEND_API' ? 'bg-[#10B981] animate-pulse' : 'bg-[#F59E0B]'}`} />
          <span className="text-slate-300 text-[11px]">
            {isApiLoading ? 'SYNCING...' : apiSource === 'BACKEND_API' ? 'API: CONNECTED' : 'DEMO FALLBACK'}
          </span>
          <RefreshCw className={`w-3 h-3 text-slate-400 ${isApiLoading ? 'animate-spin' : ''}`} />
        </button>

        <div className="hidden lg:block text-right">
          <div className="text-xs text-slate-400 font-mono">14:32:08 GMT+5.5</div>
          <div className="text-[10px] text-cyan-400 font-mono tracking-widest">SECURE UPLINK</div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Mute toggle */}
          <button
            onClick={toggleAudioWarning}
            title={audioWarningMuted ? 'Unmute siren warning audio' : 'Mute siren warning audio'}
            className={`p-2 rounded border border-[#1e293b] transition-colors ${
              audioWarningMuted 
                ? 'bg-[#101D2E] text-slate-500 hover:text-slate-300' 
                : 'bg-[#101D2E] text-[#00D4FF] shadow-[0_0_10px_rgba(0,212,255,0.2)]'
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
            className="font-sans font-semibold tracking-wide"
          >
            <span className="hidden sm:inline">1-Tap</span> Field Report
          </Button>
        </div>
      </div>
    </header>
  );
};
