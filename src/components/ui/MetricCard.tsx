import React from 'react';

interface MetricCardProps {
  id?: string;
  label: string;
  value: string | number;
  unit?: string;
  sublabel?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon?: React.ReactNode;
  riskHighlight?: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'CYAN' | 'TEAL' | 'VIOLET';
  className?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  label,
  value,
  unit,
  sublabel,
  trend,
  trendValue,
  icon,
  riskHighlight,
  className = '',
  onClick
}) => {
  const getHighlightStyle = () => {
    switch (riskHighlight) {
      case 'CRITICAL':
        return 'bg-[#142338] border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
      case 'HIGH':
        return 'bg-[#101D2E] border border-[#1e293b] ring-1 ring-orange-500/30 shadow-lg';
      case 'MODERATE':
        return 'bg-[#101D2E] border border-[#1e293b] ring-1 ring-amber-500/20 shadow-lg';
      case 'LOW':
        return 'bg-[#101D2E] border border-[#1e293b] shadow-lg';
      case 'CYAN':
        return 'bg-[#101D2E] border border-[#1e293b] shadow-lg';
      case 'VIOLET':
        return 'bg-[#101D2E] border border-[#1e293b] shadow-lg';
      default:
        return 'bg-[#101D2E] border border-[#1e293b] shadow-lg';
    }
  };

  const getValueColor = () => {
    switch (riskHighlight) {
      case 'CRITICAL':
        return 'text-red-500';
      case 'HIGH':
        return 'text-orange-500';
      case 'MODERATE':
        return 'text-amber-500';
      case 'LOW':
        return 'text-emerald-400';
      case 'CYAN':
        return 'text-white';
      case 'VIOLET':
        return 'text-[#7C5CFF]';
      default:
        return 'text-white';
    }
  };

  return (
    <div
      id={id || `metric-${label.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={onClick}
      className={`relative p-3.5 rounded border transition-all duration-200 flex flex-col justify-between ${getHighlightStyle()} ${onClick ? 'cursor-pointer hover:scale-[1.01]' : ''} ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold font-mono">
          {label}
        </span>
        {riskHighlight === 'CYAN' ? (
          <span className="w-12 h-5 bg-cyan-400/10 rounded-full flex items-center justify-center text-cyan-400 text-[9px] font-bold font-mono">
            ACTIVE
          </span>
        ) : riskHighlight === 'CRITICAL' ? (
          <span className="text-[9px] text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded font-bold font-mono animate-pulse">
            URGENT ⚠️
          </span>
        ) : riskHighlight === 'HIGH' ? (
          <div className="w-1 h-5 bg-orange-500/50 rounded-full" />
        ) : (
          icon && <span className="text-slate-400 text-sm">{icon}</span>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 my-0.5">
        <span className={`text-2xl lg:text-3xl font-mono font-bold tracking-tight ${getValueColor()}`}>
          {value}
        </span>
        {unit && (
          <span className="text-[10px] font-mono text-slate-400 uppercase">
            {unit}
          </span>
        )}
      </div>

      {(sublabel || trendValue) && (
        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          {sublabel && <span className="truncate text-slate-400">{sublabel}</span>}
          {trendValue && (
            <span className={`font-semibold flex items-center gap-0.5 ${
              trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-emerald-400' : 'text-slate-400'
            }`}>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trend === 'stable' && '→'}
              {trendValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
