import React from 'react';
import { SystemHealth } from '../../../types/api';
import { Badge } from '../../../components/ui/Badge';

export interface SystemStatusBannerProps {
  health: SystemHealth | null;
  online: boolean;
  className?: string;
}

export const SystemStatusBanner: React.FC<SystemStatusBannerProps> = ({
  health,
  online,
  className = '',
}) => {
  return (
    <div
      className={`p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-300 ${className}`}
    >
      <div className="flex items-center space-x-3">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            online ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
          }`}
        />
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-200">System Pipeline Status:</span>
          <span className="font-mono text-slate-400">
            {online ? `FastAPI v${health?.version || '0.1.0'}` : 'Offline Fallback Active'}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 font-mono text-[10px]">
        <Badge variant={health?.services?.database === 'connected' ? 'success' : 'neutral'} size="sm">
          PostGIS: {health?.services?.database || 'disconnected'}
        </Badge>
        <Badge variant={health?.services?.redis === 'connected' ? 'success' : 'neutral'} size="sm">
          Redis: {health?.services?.redis || 'disconnected'}
        </Badge>
        <Badge
          variant={health?.services?.celery_broker === 'connected' ? 'success' : 'neutral'}
          size="sm"
        >
          Celery: {health?.services?.celery_broker || 'disconnected'}
        </Badge>
      </div>
    </div>
  );
};
