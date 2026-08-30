import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'ai' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium font-sans transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#040810] disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-lg active:scale-[0.98] cursor-pointer';
  
  const sizeClasses = {
    xs: 'px-2 py-1 text-[11px] gap-1 font-mono-tech',
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs lg:text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm lg:text-base gap-2.5 font-semibold'
  };

  const variantClasses = {
    primary: 'bg-[#00D4FF] hover:bg-[#38bdf8] text-[#040810] font-bold shadow-[0_0_15px_rgba(0,212,255,0.25)] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]',
    secondary: 'bg-[#0E1D32] hover:bg-[#152945] text-slate-200 border border-[#1c2e47] hover:border-[#2b496e] shadow-sm',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] font-semibold',
    warning: 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] font-semibold',
    ghost: 'bg-transparent hover:bg-[#0E1D32] text-slate-300 hover:text-white',
    outline: 'bg-transparent border border-cyan-500/40 text-cyan-400 hover:bg-cyan-950/30 hover:border-cyan-400/70',
    ai: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-[0_0_20px_rgba(139,92,246,0.25)] border border-violet-400/30'
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      {children && <span>{children}</span>}
    </button>
  );
};
