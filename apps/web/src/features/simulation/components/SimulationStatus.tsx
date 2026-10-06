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

  const status = detail?.status || job?.status || 'QUEUED';
  const badgeVariant =
    status === 'COMPLETED'
      ? 'success'
      : status === 'RUNNING'
      ? 'warning'
      : status === 'FAILED'
      ? 'danger'
      : 'info';

  const progressPct = detail?.progress_pct ?? (status === 'COMPLETED' ? 100 : status === 'RUNNING' ? 50 : 10);
  const completedSteps = detail?.completed_steps;
  const totalSteps = detail?.total_steps;

  return (
    <div
      className={`bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-xs space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="font-semibold text-slate-200">Execution Job Status</span>
        <Badge variant={badgeVariant} size="sm">
          {status}
        </Badge>
      </div>

      {/* Progress Bar for Active Jobs */}
      {(status === 'RUNNING' || status === 'QUEUED') && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Progress:</span>
            <span>
              {completedSteps !== undefined && totalSteps !== undefined
                ? `Step ${completedSteps}/${totalSteps} (${progressPct.toFixed(0)}%)`
                : `${progressPct.toFixed(0)}%`}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                status === 'RUNNING' ? 'bg-amber-500 animate-pulse' : 'bg-slate-600'
              }`}
              style={{ width: `${Math.max(5, Math.min(100, progressPct))}%` }}
            />
          </div>
        </div>
      )}

      {/* Identifiers & Timing */}
      <div className="space-y-1 font-mono text-[11px] text-slate-400">
        <div className="flex justify-between">
          <span>Job ID:</span>
          <span className="text-slate-200 truncate max-w-[140px]">
            {detail?.id || job?.simulation_id}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Horizon:</span>
          <span className="text-slate-200">
            {detail?.duration_hours || job?.duration_hours || 12}h Horizon
          </span>
        </div>
        {detail?.engine_version && (
          <div className="flex justify-between">
            <span>Engine:</span>
            <span className="text-slate-300">{detail.engine_version}</span>
          </div>
        )}
      </div>

      {/* Completed Summary Metrics */}
      {status === 'COMPLETED' && detail?.metrics && (
        <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1.5 font-mono text-[11px]">
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            Run Telemetry
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Burned:</span>
            <span className="text-rose-400 font-bold">
              {detail.metrics.total_area_burned_ha.toFixed(1)} ha
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Peak Velocity:</span>
            <span className="text-amber-300 font-bold">
              {detail.metrics.peak_spread_velocity_kmh.toFixed(2)} km/h
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Spread Dir:</span>
            <span className="text-slate-200">
              {detail.metrics.dominant_spread_direction_deg.toFixed(0)}°
            </span>
          </div>
        </div>
      )}

      {/* Error alert */}
      {detail?.error_message && (
        <div className="text-rose-400 text-[10px] p-2 bg-rose-950/40 border border-rose-900 rounded">
          Error: {detail.error_message}
        </div>
      )}
    </div>
  );
};
