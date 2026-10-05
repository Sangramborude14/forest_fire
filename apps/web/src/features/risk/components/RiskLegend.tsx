import React from 'react';
import { APP_CONFIG } from '../../../app/config';

export interface RiskLegendProps {
  className?: string;
}

export const RiskLegend: React.FC<RiskLegendProps> = ({ className = '' }) => {
  return (
    <div
      className={`bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-slate-200">Susceptibility Scale</h4>
        <span className="text-[10px] font-mono text-slate-400">500m Cells</span>
      </div>
      <div className="space-y-1.5 font-mono text-[11px]">
        {Object.entries(APP_CONFIG.riskColors).map(([key, config]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <span
                className="w-3 h-3 rounded-sm border border-black/40"
                style={{ backgroundColor: config.fillColor }}
              />
              <span className="text-slate-300 capitalize">{config.label}</span>
            </span>
            <span className="text-slate-400 text-[10px]">{config.threshold}</span>
          </div>
        ))}
      </div>
      <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-500 italic">
        Sample/baseline susceptibility partitions (Phase 2 contract)
      </div>
    </div>
  );
};
