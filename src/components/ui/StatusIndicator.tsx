import React from 'react';

interface StatusIndicatorProps {
  status: 'ONLINE' | 'WARNING' | 'OFFLINE' | 'CALIBRATING' | 'DISPATCHED' | 'PENDING';
  label?: string;
  isSimulated?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  isSimulated = false,
  className = ''
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'ONLINE':
      case 'DISPATCHED':
        return {
          dot: 'bg-emerald-400',
          text: 'text-emerald-400',
          ping: 'bg-emerald-400'
        };
      case 'WARNING':
      case 'PENDING':
        return {
          dot: 'bg-amber-400',
          text: 'text-amber-400',
          ping: 'bg-amber-400'
        };
      case 'CALIBRATING':
        return {
          dot: 'bg-cyan-400',
          text: 'text-cyan-400',
          ping: 'bg-cyan-400'
        };
      case 'OFFLINE':
      default:
        return {
          dot: 'bg-rose-500',
          text: 'text-rose-400',
          ping: 'bg-rose-500'
        };
    }
  };

  const style = getStatusColor();

  return (
    <div className={`inline-flex items-center gap-2 font-mono-tech text-xs ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${style.ping}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${style.dot}`} />
      </span>
      <span className={`font-semibold tracking-wide ${style.text}`}>
        {label || status}
      </span>
      {isSimulated && (
        <span className="text-[10px] text-amber-300 bg-amber-950/40 px-1.5 py-0.2 rounded border border-amber-500/30 uppercase font-semibold">
          SIMULATED
        </span>
      )}
    </div>
  );
};
