import React from 'react';
import { RiskSummary, RiskClass } from '../../../types/domain';
import { APP_CONFIG, RiskLevelKey } from '../../../app/config';

export interface RiskDistributionChartProps {
  summary: RiskSummary | null;
  selectedFilter?: string;
  onSelectFilter?: (level: string) => void;
  className?: string;
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({
  summary,
  selectedFilter = 'ALL',
  onSelectFilter = () => {},
  className = '',
}) => {
  if (!summary) {
    return (
      <div
        className={`p-3.5 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-xl backdrop-blur-md text-xs ${className}`}
        role="region"
        aria-label="Risk Distribution Chart"
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
          <span className="font-semibold text-slate-200">Risk Distribution</span>
        </div>
        <p className="text-slate-500 text-center py-4 text-[11px] italic">
          Awaiting risk prediction summary...
        </p>
      </div>
    );
  }

  const totalCells = summary.total_cells || 1;
  const dist = summary.risk_distribution || { low: 0, moderate: 0, high: 0, extreme: 0 };

  const classes: { key: RiskLevelKey; classEnum: RiskClass; count: number }[] = [
    { key: 'LOW', classEnum: 'LOW', count: dist.low || 0 },
    { key: 'MODERATE', classEnum: 'MODERATE', count: dist.moderate || 0 },
    { key: 'HIGH', classEnum: 'HIGH', count: dist.high || 0 },
    { key: 'EXTREME', classEnum: 'EXTREME', count: dist.extreme || 0 },
  ];

  return (
    <div
      className={`p-3.5 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-xl backdrop-blur-md text-xs ${className}`}
      role="region"
      aria-label="Risk Distribution Chart"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
        <span className="font-semibold text-slate-200">500m Cell Breakdown</span>
        <span className="text-[10px] font-mono text-slate-400">
          {(summary.total_cells ?? 0).toLocaleString()} Cells
        </span>
      </div>

      <div className="space-y-2">
        {classes.map(({ key, count }) => {
          const config = APP_CONFIG.riskColors[key];
          const pct = totalCells > 0 ? (count / totalCells) * 100 : 0;
          const isFilterActive = (selectedFilter || 'ALL').toUpperCase() === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectFilter(isFilterActive ? 'ALL' : key)}
              aria-label={`Filter map by ${config.label} risk tier`}
              className={`w-full text-left p-1.5 rounded-lg border transition-all cursor-pointer ${
                isFilterActive
                  ? 'bg-slate-800/90 border-amber-500 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50'
              }`}
              title={`Click to filter map by ${config.label} risk`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="flex items-center space-x-1.5 font-medium">
                  <span
                    className="w-2.5 h-2.5 rounded-sm shrink-0 border border-black/30"
                    style={{ backgroundColor: config.fillColor }}
                  />
                  <span className={isFilterActive ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                    {config.label}
                  </span>
                </span>
                <span className="font-mono text-slate-300">
                  {count.toLocaleString()}{' '}
                  <span className="text-slate-500">({pct.toFixed(1)}%)</span>
                </span>
              </div>

              {/* Horizontal Bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(1, pct)}%`,
                    backgroundColor: config.fillColor,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>Click bar to filter map</span>
        {selectedFilter !== 'ALL' && (
          <button
            onClick={() => onSelectFilter('ALL')}
            className="text-amber-400 hover:underline"
          >
            Clear Filter (Show All)
          </button>
        )}
      </div>
    </div>
  );
};
