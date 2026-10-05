import React from 'react';
import { RegionSummary } from '../../../types/domain';

export interface RegionSelectorProps {
  regions: RegionSummary[];
  selectedRegionId: string;
  onSelectRegion: (id: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  regions,
  selectedRegionId,
  onSelectRegion,
  isLoading = false,
  className = '',
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-slate-400 font-medium text-xs hidden sm:inline">Region:</span>
      <select
        value={selectedRegionId}
        disabled={isLoading || regions.length === 0}
        onChange={(e) => onSelectRegion(e.target.value)}
        className="bg-slate-800/90 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer disabled:opacity-50"
        aria-label="Select Monitored Forest Region"
      >
        {regions.length === 0 ? (
          <option value="">{isLoading ? 'Loading regions...' : 'No regions available'}</option>
        ) : (
          regions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} ({r.code})
            </option>
          ))
        )}
      </select>
    </div>
  );
};
