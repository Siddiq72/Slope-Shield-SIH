import React from 'react';

interface ProgressBarProps {
  label: string;
  value: number; // 0-100
  rawValue?: string;
  weight?: string;
  variant?: 'cyan' | 'teal' | 'violet' | 'risk' | 'amber';
  riskScore?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  rawValue,
  weight,
  variant = 'cyan',
  riskScore,
  className = ''
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  const getBarColor = () => {
    if (variant === 'risk' || riskScore !== undefined) {
      const score = riskScore !== undefined ? riskScore : clamped;
      if (score >= 85) return 'bg-[#EF4444] shadow-[0_0_8px_#EF4444]';
      if (score >= 70) return 'bg-[#F97316] shadow-[0_0_8px_#F97316]';
      if (score >= 45) return 'bg-[#F59E0B]';
      return 'bg-[#10B981]';
    }
    switch (variant) {
      case 'teal':
        return 'bg-[#14E6C5] shadow-[0_0_8px_#14E6C5]';
      case 'violet':
        return 'bg-[#7C5CFF] shadow-[0_0_8px_#7C5CFF]';
      case 'amber':
        return 'bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]';
      case 'cyan':
      default:
        return 'bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]';
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs font-sans">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200 tracking-wide">{label}</span>
          {weight && <span className="text-[10px] font-mono-tech text-slate-500 font-normal">({weight})</span>}
        </div>
        <div className="flex items-baseline gap-1.5 font-mono-tech">
          {rawValue && <span className="text-slate-400 text-[11px]">{rawValue}</span>}
          <span className="font-bold text-slate-100">{clamped}%</span>
        </div>
      </div>

      <div className="h-2 w-full bg-[#07111F] rounded-full overflow-hidden border border-[#182B42] p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor()}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
