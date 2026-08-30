import React from 'react';

interface SectionHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  subtitle,
  badge,
  actions,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#18283E] ${className}`}>
      <div className="flex items-center gap-2.5">
        {icon && (
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0E1D32] border border-[#203550] text-[#00D4FF] shadow-inner">
            {icon}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm lg:text-base font-bold text-slate-100 font-sans tracking-tight uppercase">
              {title}
            </h2>
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs font-mono-tech text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};
