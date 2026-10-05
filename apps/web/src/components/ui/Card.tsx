import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  bodyClassName = '',
}) => {
  return (
    <div
      className={`bg-slate-900/90 border border-slate-800 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden flex flex-col ${className}`}
    >
      {(title || action) && (
        <div className="px-4 py-3 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                {title}
              </h3>
            ) : (
              title
            )}
            {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center space-x-2">{action}</div>}
        </div>
      )}
      <div className={`p-4 flex-1 ${bodyClassName}`}>{children}</div>
    </div>
  );
};
