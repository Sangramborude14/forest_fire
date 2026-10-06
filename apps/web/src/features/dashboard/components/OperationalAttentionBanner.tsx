import React from 'react';
import { NavTab } from '../../../components/layout/Navigation';

export interface OperationalAttentionBannerProps {
  regionName?: string;
  activeFireCount: number;
  highRiskCellCount: number;
  extremeRiskCellCount: number;
  maxProbability: number;
  forecastDate?: string;
  onNavigateTab: (tab: NavTab) => void;
  className?: string;
}

export const OperationalAttentionBanner: React.FC<OperationalAttentionBannerProps> = ({
  regionName = 'Monitored Sector',
  activeFireCount,
  highRiskCellCount,
  extremeRiskCellCount,
  maxProbability,
  forecastDate,
  onNavigateTab,
  className = '',
}) => {
  const elevatedRiskTotal = highRiskCellCount + extremeRiskCellCount;

  // Determine operational attention level
  let severity: 'HIGH_ATTENTION' | 'WARNING' | 'INFO' = 'INFO';
  let title = 'Sector Operational Baseline';
  let message = `Normal baseline state for ${regionName}. No active thermal hotspots or elevated fire fronts detected in the 500m grid.`;
  let actionLabel = 'Explore Environmental Context';
  let targetTab: NavTab = 'layers';

  if (extremeRiskCellCount > 0 || (highRiskCellCount > 0 && activeFireCount > 0)) {
    severity = 'HIGH_ATTENTION';
    title = 'High Operational Attention Required';
    message = `${elevatedRiskTotal} grid cells exhibit elevated or extreme fire susceptibility in ${regionName} (Peak probability: ${(maxProbability * 100).toFixed(0)}%)${
      activeFireCount > 0 ? ` with ${activeFireCount} active thermal hotspots detected` : ''
    }. Recommend aerial/ground verification.`;
    actionLabel = 'Inspect 24h Risk Layer';
    targetTab = 'risk';
  } else if (activeFireCount > 0) {
    severity = 'WARNING';
    title = 'Active Satellite Thermal Anomalies Detected';
    message = `${activeFireCount} thermal hotspots observed by VIIRS/MODIS sensors within the past 24-hour observation window in ${regionName}.`;
    actionLabel = 'View Active Hotspots';
    targetTab = 'active_fires';
  } else if (highRiskCellCount > 0) {
    severity = 'WARNING';
    title = 'Elevated Fire Susceptibility Detected';
    message = `${highRiskCellCount} grid cells are estimated in the high susceptibility class for the ${forecastDate || '24h'} forecast window.`;
    actionLabel = 'Review Risk Forecast';
    targetTab = 'risk';
  }

  const severityStyles = {
    HIGH_ATTENTION: {
      border: 'border-rose-500/40 bg-rose-950/20',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      title: 'text-rose-400',
      icon: '🚨',
      btn: 'bg-rose-600/30 text-rose-200 border-rose-500/50 hover:bg-rose-600/40',
    },
    WARNING: {
      border: 'border-amber-500/40 bg-amber-950/20',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      title: 'text-amber-400',
      icon: '⚠️',
      btn: 'bg-amber-600/30 text-amber-200 border-amber-500/50 hover:bg-amber-600/40',
    },
    INFO: {
      border: 'border-sky-500/30 bg-sky-950/20',
      badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      title: 'text-sky-400',
      icon: '🛡️',
      btn: 'bg-sky-600/30 text-sky-200 border-sky-500/40 hover:bg-sky-600/40',
    },
  };

  const style = severityStyles[severity];

  return (
    <div
      className={`rounded-xl border p-3.5 backdrop-blur-sm shadow-md transition-all ${style.border} ${className}`}
      role="region"
      aria-label="Operational Attention Advisory"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-base">{style.icon}</span>
            <span
              className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${style.badge}`}
            >
              {severity === 'HIGH_ATTENTION'
                ? 'High Attention'
                : severity === 'WARNING'
                ? 'Warning'
                : 'Advisory'}
            </span>
            <span className={`font-semibold text-xs tracking-tight ${style.title}`}>
              {title}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed max-w-3xl">
            {message}
          </p>
          <p className="text-[10px] text-slate-500 font-mono">
            * Operational intelligence derived from XGBoost 24h predictions and FIRMS satellite observations.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab(targetTab)}
          className={`shrink-0 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center space-x-1.5 ${style.btn}`}
        >
          <span>{actionLabel}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
