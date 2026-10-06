import React, { useState, useMemo } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredRegions = useMemo(() => {
    if (!searchQuery.trim()) return regions;
    const q = searchQuery.toLowerCase();
    return regions.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        (r.state && r.state.toLowerCase().includes(q))
    );
  }, [regions, searchQuery]);

  return (
    <div className={`flex items-center space-x-1.5 ${className}`}>
      <span className="text-slate-400 font-medium text-xs hidden md:inline">Region:</span>

      {showSearch ? (
        <div className="flex items-center space-x-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sector/state..."
            className="w-36 sm:w-44 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            autoFocus
          />
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setShowSearch(false);
            }}
            className="text-slate-400 hover:text-slate-200 text-xs px-1"
            title="Close Search"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowSearch(true)}
          className="text-slate-400 hover:text-amber-400 p-1 rounded hover:bg-slate-800 text-xs transition-colors hidden sm:inline"
          title="Filter Region List"
          aria-label="Filter regions"
        >
          🔍
        </button>
      )}

      <select
        value={selectedRegionId}
        disabled={isLoading || regions.length === 0}
        onChange={(e) => onSelectRegion(e.target.value)}
        className="bg-slate-800/90 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer disabled:opacity-50 max-w-[200px] sm:max-w-[260px] truncate"
        aria-label="Select Monitored Forest Region"
      >
        {regions.length === 0 ? (
          <option value="">{isLoading ? 'Loading regions...' : 'No regions available'}</option>
        ) : filteredRegions.length === 0 ? (
          <option value="">No regions match "{searchQuery}"</option>
        ) : (
          filteredRegions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} ({r.code})
            </option>
          ))
        )}
      </select>
    </div>
  );
};

