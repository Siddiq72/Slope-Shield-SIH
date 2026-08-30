import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  showDot?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ 
  level, 
  className = '', 
  showDot = true,
  size = 'md'
}) => {
  const getBadgeStyle = (lvl: RiskLevel) => {
    switch (lvl) {
      case 'CRITICAL':
        return {
          bg: 'bg-[#EF4444]/15 border-[#EF4444]/60 text-[#EF4444]',
          dot: 'bg-[#EF4444] animate-ping'
        };
      case 'HIGH':
        return {
          bg: 'bg-[#F97316]/15 border-[#F97316]/60 text-[#F97316]',
          dot: 'bg-[#F97316]'
        };
      case 'MODERATE':
        return {
          bg: 'bg-[#F59E0B]/15 border-[#F59E0B]/60 text-[#F59E0B]',
          dot: 'bg-[#F59E0B]'
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-[#10B981]/15 border-[#10B981]/60 text-[#10B981]',
          dot: 'bg-[#10B981]'
        };
    }
  };

  const style = getBadgeStyle(level);
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs tracking-wider',
    md: 'px-2.5 py-1 text-xs font-semibold tracking-wider',
    lg: 'px-3.5 py-1.5 text-sm font-bold tracking-widest'
  };

  return (
    <span 
      id={`risk-badge-${level.toLowerCase()}`}
      className={`inline-flex items-center gap-1.5 rounded border ${style.bg} ${sizeClasses[size]} font-mono-tech uppercase shadow-sm ${className}`}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          {level === 'CRITICAL' && (
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${style.dot}`} />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${level === 'CRITICAL' ? 'bg-[#EF4444]' : style.dot.split(' ')[0]}`} />
        </span>
      )}
      <span>{level}</span>
    </span>
  );
};

export const TechBadge: React.FC<{ 
  label: string; 
  variant?: 'cyan' | 'teal' | 'violet' | 'blue' | 'muted';
  className?: string;
}> = ({ label, variant = 'cyan', className = '' }) => {
  const styles = {
    cyan: 'bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30',
    teal: 'bg-[#14E6C5]/10 text-[#14E6C5] border-[#14E6C5]/30',
    violet: 'bg-[#7C5CFF]/15 text-[#7C5CFF] border-[#7C5CFF]/30',
    blue: 'bg-[#5B8CFF]/10 text-[#5B8CFF] border-[#5B8CFF]/30',
    muted: 'bg-slate-800/60 text-slate-400 border-slate-700'
  };

  return (
    <span 
      id={`tech-badge-${label.toLowerCase().replace(/\s+/g, '-')}`}
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono-tech border uppercase tracking-wider ${styles[variant]} ${className}`}
    >
      {label}
    </span>
  );
};
