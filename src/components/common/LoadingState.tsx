import React from 'react';
import { Radio, Loader2 } from 'lucide-react';

interface LoadingStateProps {
  label?: string;
  sublabel?: string;
  variant?: 'card' | 'fullscreen' | 'inline' | 'skeleton';
  heightClass?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'ACQUIRING TELEMETRY STREAM...',
  sublabel = 'Syncing geotechnical sensors, Doppler feeds & InSAR models',
  variant = 'card',
  heightClass = 'min-h-[220px]',
}) => {
  if (variant === 'skeleton') {
    return (
      <div className={`w-full rounded-xl bg-[#0B1728] border border-[#18283E] p-5 animate-pulse space-y-4 ${heightClass}`}>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-[#142844] rounded w-1/3"></div>
          <div className="h-4 bg-[#142844] rounded w-16"></div>
        </div>
        <div className="space-y-2.5">
          <div className="h-3 bg-[#101F34] rounded w-full"></div>
          <div className="h-3 bg-[#101F34] rounded w-5/6"></div>
          <div className="h-3 bg-[#101F34] rounded w-3/4"></div>
        </div>
        <div className="h-24 bg-[#0E1D32] rounded-lg border border-[#18283E]"></div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 py-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>{label}</span>
      </div>
    );
  }

  return (
    <div className={`w-full flex flex-col items-center justify-center p-8 rounded-xl bg-[#0B1728]/80 border border-[#18283E] text-center ${heightClass}`}>
      <div className="relative mb-4 flex items-center justify-center">
        {/* Radar concentric wave */}
        <div className="absolute w-14 h-14 rounded-full border border-cyan-500/20 animate-ping"></div>
        <div className="w-12 h-12 rounded-xl bg-[#0E1D32] border border-[#2B496E] flex items-center justify-center text-[#00D4FF] shadow-lg shadow-cyan-950/40">
          <Radio className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      <h4 className="text-xs font-bold font-mono-tech text-slate-100 tracking-wider uppercase mb-1">
        {label}
      </h4>
      {sublabel && (
        <p className="text-[11px] font-mono-tech text-slate-400 max-w-sm">
          {sublabel}
        </p>
      )}
    </div>
  );
};
