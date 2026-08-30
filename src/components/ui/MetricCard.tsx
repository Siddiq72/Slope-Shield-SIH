import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

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
        return 'bg-[#0E1726] border-rose-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:border-rose-400';
      case 'HIGH':
        return 'bg-[#0B1728] border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.1)] hover:border-orange-400';
      case 'MODERATE':
        return 'bg-[#0B1728] border-amber-500/30 hover:border-amber-400';
      case 'LOW':
        return 'bg-[#0B1728] border-emerald-500/30 hover:border-emerald-400';
      case 'CYAN':
        return 'bg-[#0B1728] border-cyan-500/30 shadow-[0_0_15px_rgba(0,212,255,0.08)] hover:border-cyan-400';
      case 'VIOLET':
        return 'bg-[#0B1728] border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.1)] hover:border-violet-400';
      default:
        return 'bg-[#0B1728] border-[#1c2e47] hover:border-[#2b496e]';
    }
  };

  const getValueColor = () => {
    switch (riskHighlight) {
      case 'CRITICAL':
        return 'text-rose-400';
      case 'HIGH':
        return 'text-orange-400';
      case 'MODERATE':
        return 'text-amber-400';
      case 'LOW':
        return 'text-emerald-400';
      case 'CYAN':
        return 'text-cyan-300';
      case 'VIOLET':
        return 'text-violet-300';
      default:
        return 'text-slate-100';
    }
  };

  const getTrendColor = () => {
    if (trend === 'up') {
      return riskHighlight === 'CRITICAL' || riskHighlight === 'HIGH' ? 'text-rose-400' : 'text-emerald-400';
    }
    if (trend === 'down') {
      return 'text-emerald-400';
    }
    return 'text-slate-400';
  };

  return (
    <div
      id={id || `metric-${label.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={onClick}
      className={`relative p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between group ${getHighlightStyle()} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0' : ''
      } ${className}`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold font-mono-tech">
          {label}
        </span>
        {icon && (
          <div className="w-7 h-7 rounded-lg bg-[#0E1D32] border border-[#1c2e47] flex items-center justify-center text-slate-300 group-hover:text-cyan-300 transition-colors">
            {icon}
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline gap-1.5 my-1">
        <span className={`text-2xl sm:text-3xl font-mono-tech font-extrabold tracking-tight ${getValueColor()}`}>
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono-tech text-slate-400 font-medium">
            {unit}
          </span>
        )}
      </div>

      {/* Card Footer: Sublabel + Trend */}
      {(sublabel || trendValue) && (
        <div className="mt-2 pt-2 border-t border-[#142844]/60 flex items-center justify-between text-[11px] font-mono-tech">
          {sublabel && (
            <span className="truncate text-slate-400 max-w-[70%]">
              {sublabel}
            </span>
          )}
          {trendValue && (
            <span className={`font-bold flex items-center gap-0.5 ${getTrendColor()}`}>
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {trend === 'stable' && <Minus className="w-3 h-3" />}
              <span>{trendValue}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
