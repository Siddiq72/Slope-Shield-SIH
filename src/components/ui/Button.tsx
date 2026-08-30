import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'ai';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/40 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-lg';
  
  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5 font-semibold'
  };

  const variantClasses = {
    primary: 'bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#050912] font-semibold shadow-lg shadow-[#00D4FF]/20 hover:shadow-[#00D4FF]/40',
    secondary: 'bg-[#101D2E] hover:bg-[#142338] text-slate-100 border border-[#182B42] hover:border-[#264366]',
    danger: 'bg-[#EF4444] hover:bg-[#EF4444]/90 text-white shadow-lg shadow-[#EF4444]/20 hover:shadow-[#EF4444]/40 font-semibold',
    ghost: 'bg-transparent hover:bg-[#101D2E] text-slate-300 hover:text-white',
    outline: 'bg-transparent border border-[#00D4FF]/40 text-[#00D4FF] hover:bg-[#00D4FF]/10',
    ai: 'bg-gradient-to-r from-[#7C5CFF] to-[#5B8CFF] hover:opacity-95 text-white font-semibold shadow-lg shadow-[#7C5CFF]/20'
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
