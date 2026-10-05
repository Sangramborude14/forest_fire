import React from 'react';
import { Button } from '../ui/Button';

export interface ErrorAlertProps {
  title?: string;
  message: string;
  code?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'Service Unavailable',
  message,
  code,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200 flex flex-col space-y-2 backdrop-blur-sm ${className}`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-rose-400">⚠️</span>
          <span className="font-semibold text-xs tracking-wide">{title}</span>
        </div>
        {code && (
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-rose-900/60 border border-rose-700/60 text-rose-300">
            {code}
          </span>
        )}
      </div>
      <p className="text-xs text-rose-300/90 leading-relaxed">{message}</p>
      {onRetry && (
        <div className="pt-2 flex justify-end">
          <Button variant="danger" size="sm" onClick={onRetry}>
            Retry Request
          </Button>
        </div>
      )}
    </div>
  );
};
