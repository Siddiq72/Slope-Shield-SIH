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
          dot: 'bg-[#10B981]',
          text: 'text-[#10B981]',
          ping: 'bg-[#10B981]'
        };
      case 'WARNING':
      case 'PENDING':
        return {
          dot: 'bg-[#F59E0B]',
          text: 'text-[#F59E0B]',
          ping: 'bg-[#F59E0B]'
        };
      case 'OFFLINE':
      default:
        return {
          dot: 'bg-[#EF4444]',
          text: 'text-[#EF4444]',
          ping: 'bg-[#EF4444]'
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
        <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700 uppercase">
          SIMULATED
        </span>
      )}
    </div>
  );
};
