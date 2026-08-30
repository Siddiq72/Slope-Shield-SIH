import React from 'react';
import { RiskLevel } from '../../types';
import { ShieldAlert, AlertTriangle, CheckCircle2, Flame, Sparkles, Database } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  showDot?: boolean;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ 
  level, 
  className = '', 
  showDot = true,
  showIcon = false,
  size = 'md'
}) => {
  const getBadgeStyle = (lvl: RiskLevel) => {
    switch (lvl) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-950/40 border-rose-500/50 text-rose-400 shadow-[0_0_12px_rgba(239,68,68,0.25)]',
          dot: 'bg-rose-500',
          icon: <Flame className="w-3.5 h-3.5 text-rose-400" />
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-950/40 border-orange-500/50 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.2)]',
          dot: 'bg-orange-500',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
        };
      case 'MODERATE':
        return {
          bg: 'bg-yellow-950/40 border-amber-500/50 text-amber-400',
          dot: 'bg-amber-400',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400',
          dot: 'bg-emerald-400',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        };
    }
  };

  const style = getBadgeStyle(level);
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] tracking-wider font-semibold',
    md: 'px-2.5 py-1 text-xs font-semibold tracking-wider',
    lg: 'px-3.5 py-1.5 text-xs lg:text-sm font-bold tracking-widest'
  };

  return (
    <span 
      id={`risk-badge-${level.toLowerCase()}`}
      className={`inline-flex items-center gap-1.5 rounded-md border font-mono-tech uppercase ${style.bg} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && style.icon}
      {showDot && !showIcon && (
        <span className="relative flex h-2 w-2">
          {level === 'CRITICAL' && (
            <span className="absolute inline-flex h-full w-full rounded-full opacity-75 bg-rose-500 animate-ping" />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${style.dot}`} />
        </span>
      )}
      <span>{level}</span>
    </span>
  );
};

export const TechBadge: React.FC<{ 
  label: string; 
  variant?: 'cyan' | 'teal' | 'violet' | 'blue' | 'amber' | 'muted';
  icon?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}> = ({ label, variant = 'cyan', icon, className = '', size = 'sm' }) => {
  const styles = {
    cyan: 'bg-cyan-950/50 text-cyan-300 border-cyan-500/35 shadow-[0_0_10px_rgba(0,212,255,0.1)]',
    teal: 'bg-teal-950/50 text-teal-300 border-teal-500/35',
    violet: 'bg-violet-950/50 text-violet-300 border-violet-500/35 shadow-[0_0_10px_rgba(139,92,246,0.15)]',
    blue: 'bg-blue-950/50 text-blue-300 border-blue-500/35',
    amber: 'bg-amber-950/50 text-amber-300 border-amber-500/35',
    muted: 'bg-slate-900/70 text-slate-400 border-slate-700/60'
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span 
      id={`tech-badge-${label.toLowerCase().replace(/\s+/g, '-')}`}
      className={`inline-flex items-center gap-1.5 rounded border font-mono-tech uppercase font-semibold tracking-wider ${styles[variant]} ${sizeClass} ${className}`}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
};

export const SimulationBadge: React.FC<{
  label?: string;
  className?: string;
}> = ({ label = 'CALIBRATED SIMULATION', className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/40 text-amber-300 text-[10px] font-mono-tech font-bold uppercase tracking-wider ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
      <span>{label}</span>
    </span>
  );
};
