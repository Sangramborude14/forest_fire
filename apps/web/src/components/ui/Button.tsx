import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-amber-600 hover:bg-amber-500 text-white border-amber-600 focus:ring-amber-500 shadow-sm',
    secondary:
      'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 focus:ring-slate-500',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white border-rose-600 focus:ring-rose-500',
    ghost:
      'bg-transparent hover:bg-slate-800 text-slate-300 border-transparent hover:border-slate-700 focus:ring-slate-500',
    outline:
      'bg-transparent hover:bg-slate-800/60 text-slate-200 border-slate-700 focus:ring-slate-500',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 rounded',
    md: 'text-xs px-3.5 py-1.5 rounded-lg',
    lg: 'text-sm px-4 py-2 rounded-lg',
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-medium border transition-colors focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : icon ? (
        <span className="mr-1.5">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
