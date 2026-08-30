import React from 'react';

interface ProgressBarProps {
  label: string;
  value: number; // 0-100
  rawValue?: string;
  weight?: string;
  variant?: 'cyan' | 'teal' | 'violet' | 'risk' | 'amber' | 'emerald';
  riskScore?: number;
  showPercent?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  rawValue,
  weight,
  variant = 'cyan',
  riskScore,
  showPercent = true,
  className = ''
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  const getBarColor = () => {
    if (variant === 'risk' || riskScore !== undefined) {
      const score = riskScore !== undefined ? riskScore : clamped;
      if (score >= 85) return 'bg-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]';
      if (score >= 70) return 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]';
      if (score >= 45) return 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
      return 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
    }
    switch (variant) {
      case 'teal':
        return 'bg-teal-400 shadow-[0_0_10px_rgba(20,230,197,0.5)]';
      case 'violet':
        return 'bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.6)]';
      case 'amber':
        return 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
      case 'emerald':
        return 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
      case 'cyan':
      default:
        return 'bg-cyan-400 shadow-[0_0_10px_rgba(0,212,255,0.6)]';
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs font-sans">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-200 tracking-tight">{label}</span>
          {weight && <span className="text-[10px] font-mono-tech text-slate-400">({weight})</span>}
        </div>
        <div className="flex items-baseline gap-2 font-mono-tech">
          {rawValue && <span className="text-slate-400 text-[11px] font-normal">{rawValue}</span>}
          {showPercent && <span className="font-bold text-slate-100">{clamped}%</span>}
        </div>
      </div>

      <div className="h-2 w-full bg-[#07111F] rounded-full overflow-hidden border border-[#18283E]">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${getBarColor()}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
