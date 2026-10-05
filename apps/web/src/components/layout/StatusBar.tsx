import React from 'react';

export interface StatusBarProps {
  regionName?: string;
  totalCells?: number;
  activeLayerName?: string;
  className?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  regionName = 'Uttarakhand Western Himalaya',
  totalCells = 11362,
  activeLayerName = '24h Susceptibility',
  className = '',
}) => {
  return (
    <footer
      className={`h-6 bg-slate-950 border-t border-slate-800/80 px-4 flex items-center justify-between text-[11px] text-slate-400 font-mono shrink-0 z-20 select-none ${className}`}
    >
      <div className="flex items-center space-x-4">
        <span>Region: <strong className="text-slate-200">{regionName}</strong></span>
        <span className="hidden md:inline">Coverage: {(totalCells ?? 0).toLocaleString()} Cells (500m)</span>
      </div>
      <div className="flex items-center space-x-4">
        <span>CRS: <strong className="text-slate-300">EPSG:4326</strong></span>
        <span className="text-amber-400 font-semibold uppercase hidden sm:inline">
          Active: {activeLayerName}
        </span>
      </div>
    </footer>
  );
};
