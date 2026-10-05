import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'border-slate-800 bg-slate-900/80 text-slate-100',
    success: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400',
    warning: 'border-amber-500/30 bg-amber-950/20 text-amber-400',
    danger: 'border-rose-500/30 bg-rose-950/20 text-rose-400',
  };

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-sm shadow-sm flex flex-col justify-between ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
        <span>{title}</span>
        {icon && <span>{icon}</span>}
      </div>
      <div className="text-2xl font-bold font-mono tracking-tight my-1 text-slate-100">
        {value}
      </div>
      {subtitle && <div className="text-xs text-slate-400 mt-1">{subtitle}</div>}
    </div>
  );
};
