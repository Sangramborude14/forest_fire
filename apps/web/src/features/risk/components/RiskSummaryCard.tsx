import React from 'react';
import { RiskSummary } from '../../../types/domain';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/feedback/Skeleton';

export interface RiskSummaryCardProps {
  summary: RiskSummary | null;
  isLoading?: boolean;
  className?: string;
}

export const RiskSummaryCard: React.FC<RiskSummaryCardProps> = ({
  summary,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`p-4 bg-slate-900/90 border border-slate-800 rounded-xl ${className}`}>
        <Skeleton className="h-4 w-32 mb-3" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className={`p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-400 ${className}`}>
        Risk summary unavailable for selected region.
      </div>
    );
  }

  const totalCells = summary.total_cells || 1;
  const dist = summary.risk_distribution || { low: 0, moderate: 0, high: 0, extreme: 0 };
  const lowPct = Math.round(((dist.low || 0) / totalCells) * 100);
  const modPct = Math.round(((dist.moderate || 0) / totalCells) * 100);
  const highPct = Math.round(((dist.high || 0) / totalCells) * 100);
  const extPct = Math.round(((dist.extreme || 0) / totalCells) * 100);

  return (
    <div
      className={`p-4 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-xl backdrop-blur-md text-xs ${className}`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
        <div>
          <h4 className="font-semibold text-slate-100">Regional Risk Distribution</h4>
          <span className="text-[10px] font-mono text-slate-400">
            Target: {summary.target_date || 'Current Date'}
          </span>
        </div>
        <Badge variant={summary.extreme_risk_cells > 0 ? 'danger' : 'warning'} size="sm">
          Mean: {(summary.mean_probability * 100).toFixed(1)}%
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Total Grid Cells</span>
          <span className="text-base font-bold text-slate-100 font-mono">
            {(summary.total_cells ?? 0).toLocaleString()}
          </span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 block">High/Extreme Cells</span>
          <span className="text-base font-bold text-rose-400 font-mono">
            {((summary.high_risk_cells ?? 0) + (summary.extreme_risk_cells ?? 0)).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Distribution progress bar */}
      <div>
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
          <span>Class Breakdown:</span>
          <span>100% Partition</span>
        </div>
        <div className="h-2 w-full rounded-full overflow-hidden flex bg-slate-800">
          <div style={{ width: `${lowPct}%` }} className="bg-emerald-500 h-full" title={`Low: ${lowPct}%`} />
          <div style={{ width: `${modPct}%` }} className="bg-amber-500 h-full" title={`Moderate: ${modPct}%`} />
          <div style={{ width: `${highPct}%` }} className="bg-orange-500 h-full" title={`High: ${highPct}%`} />
          <div style={{ width: `${extPct}%` }} className="bg-rose-500 h-full" title={`Extreme: ${extPct}%`} />
        </div>
        <div className="grid grid-cols-4 gap-1 text-[9px] font-mono text-slate-400 mt-2 text-center">
          <span className="text-emerald-400">{lowPct}% Low</span>
          <span className="text-amber-400">{modPct}% Mod</span>
          <span className="text-orange-400">{highPct}% High</span>
          <span className="text-rose-400">{extPct}% Ext</span>
        </div>
      </div>
    </div>
  );
};
