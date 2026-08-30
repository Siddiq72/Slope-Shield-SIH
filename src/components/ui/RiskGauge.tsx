import React from 'react';
import { RiskLevel } from '../../types';

interface RiskGaugeProps {
  score: number; // 0-100
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  sublabel?: string;
  showLabels?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  level,
  size = 'md',
  label = 'AI RISK SCORE',
  sublabel,
  showLabels = true
}) => {
  // Clamp score
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  
  // Radial arc math: 180 degrees semi-circle
  const radius = size === 'sm' ? 44 : size === 'lg' ? 82 : 64;
  const strokeWidth = size === 'sm' ? 8 : size === 'lg' ? 14 : 11;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const getColor = (lvl: RiskLevel) => {
    switch (lvl) {
      case 'CRITICAL':
        return '#EF4444';
      case 'HIGH':
        return '#F97316';
      case 'MODERATE':
        return '#F59E0B';
      case 'LOW':
      default:
        return '#10B981';
    }
  };

  const currentColor = getColor(level);
  const width = radius * 2 + strokeWidth * 2;
  const height = radius + strokeWidth * 2 + 12;

  return (
    <div className="flex flex-col items-center justify-center p-3 text-center">
      {label && (
        <span className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-1 font-mono-tech">
          {label}
        </span>
      )}
      
      <div className="relative" style={{ width, height }}>
        <svg
          width={width}
          height={height}
          className="overflow-visible"
          viewBox={`0 0 ${width} ${height}`}
        >
          {/* Background track */}
          <path
            d={`M ${strokeWidth}, ${radius + strokeWidth} A ${radius} ${radius} 0 0 1 ${width - strokeWidth} ${radius + strokeWidth}`}
            fill="none"
            stroke="#142844"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active progress arc */}
          <path
            d={`M ${strokeWidth}, ${radius + strokeWidth} A ${radius} ${radius} 0 0 1 ${width - strokeWidth} ${radius + strokeWidth}`}
            fill="none"
            stroke={currentColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease',
              filter: `drop-shadow(0 0 10px ${currentColor}80)`
            }}
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-x-0 bottom-1 flex flex-col items-center justify-center">
          <div className="flex items-baseline gap-0.5">
            <span className="text-3xl lg:text-4xl font-extrabold font-mono-tech tracking-tight" style={{ color: currentColor }}>
              {clampedScore}
            </span>
            <span className="text-xs font-mono-tech text-slate-400 font-semibold">/100</span>
          </div>
          <span 
            className="text-[11px] font-bold font-mono-tech uppercase tracking-wider px-2 py-0.5 rounded mt-0.5"
            style={{ 
              backgroundColor: `${currentColor}18`, 
              color: currentColor, 
              border: `1px solid ${currentColor}50` 
            }}
          >
            {level}
          </span>
        </div>
      </div>

      {sublabel && (
        <span className="text-[11px] font-mono-tech text-slate-400 mt-1">
          {sublabel}
        </span>
      )}

      {showLabels && (
        <div className="w-full flex justify-between px-2 text-[10px] font-mono-tech text-slate-400 mt-1">
          <span>0 (STABLE)</span>
          <span>50</span>
          <span>100 (CRITICAL)</span>
        </div>
      )}
    </div>
  );
};
