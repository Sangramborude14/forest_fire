import React from 'react';
import { SimulationJob, SimulationDetail } from '../../../types/domain';
import { Badge } from '../../../components/ui/Badge';

export interface SimulationStatusProps {
  job: SimulationJob | null;
  detail: SimulationDetail | null;
  className?: string;
}

export const SimulationStatus: React.FC<SimulationStatusProps> = ({
  job,
  detail,
  className = '',
}) => {
  if (!job && !detail) return null;

  const status = detail?.status || job?.status || 'PENDING';
  const badgeVariant =
    status === 'COMPLETED'
      ? 'success'
      : status === 'RUNNING'
      ? 'warning'
      : status === 'FAILED'
      ? 'danger'
      : 'info';

  return (
    <div
      className={`bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-xs space-y-2 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-200">Execution Job Status</span>
        <Badge variant={badgeVariant} size="sm">
          {status}
        </Badge>
      </div>

      <div className="space-y-1 font-mono text-[11px] text-slate-400">
        <div className="flex justify-between">
          <span>Job ID:</span>
          <span className="text-slate-200 truncate max-w-[140px]">
            {detail?.id || job?.simulation_id}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Ignition Source:</span>
          <span className="text-slate-200">{detail?.ignition_source || 'Map Origin'}</span>
        </div>
        {detail?.error_message && (
          <div className="text-rose-400 text-[10px] pt-1 border-t border-slate-800">
            Error: {detail.error_message}
          </div>
        )}
      </div>
    </div>
  );
};
