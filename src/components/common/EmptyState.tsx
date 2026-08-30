import React from 'react';
import { Layers, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  heightClass?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  heightClass = 'min-h-[220px]',
}) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center p-8 rounded-xl bg-[#0B1728] border border-[#18283E] text-center ${heightClass}`}>
      <div className="w-12 h-12 rounded-xl bg-[#0E1D32] border border-[#203550] flex items-center justify-center text-slate-400 mb-3 shadow-inner">
        {icon || <Layers className="w-6 h-6" />}
      </div>

      <h4 className="text-sm font-bold font-sans text-slate-200 tracking-tight mb-1">
        {title}
      </h4>

      {description && (
        <p className="text-xs font-mono-tech text-slate-400 max-w-md mb-4">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAction}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
