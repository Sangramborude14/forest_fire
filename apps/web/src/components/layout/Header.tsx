import React, { useEffect, useState } from 'react';
import { fetchHealth } from '../../services/api/health';
import { SystemHealth } from '../../types/api';
import { RegionSummary } from '../../types/domain';
import { RegionSelector } from '../../features/regions/components/RegionSelector';

export interface HeaderProps {
  currentView: string;
  regions: RegionSummary[];
  selectedRegionId: string;
  onSelectRegion: (id: string) => void;
  isLoadingRegions?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  regions,
  selectedRegionId,
  onSelectRegion,
  isLoadingRegions = false,
}) => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [online, setOnline] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    fetchHealth()
      .then((data) => {
        if (mounted) {
          setHealth(data);
          setOnline(data.status === 'healthy');
        }
      })
      .catch(() => {
        if (mounted) setOnline(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 select-none shrink-0 z-30">
      {/* Brand & Title */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center font-bold text-white shadow-md text-base">
          🔥
        </div>
        <div>
          <h1 className="font-semibold text-xs sm:text-sm text-slate-100 tracking-wide flex items-center space-x-2">
            <span>ISRO Forest Fire Platform</span>
            <span className="hidden md:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800">
              500m Grid
            </span>
          </h1>
          <p className="text-[10px] text-slate-400 hidden sm:block">
            Predictive Susceptibility & 12h Spread Simulation
          </p>
        </div>
      </div>

      {/* Region Selector in Header */}
      <div className="flex items-center space-x-3">
        <RegionSelector
          regions={regions}
          selectedRegionId={selectedRegionId}
          onSelectRegion={onSelectRegion}
          isLoading={isLoadingRegions}
        />

        {/* Current View Pill */}
        <span className="text-slate-400 uppercase tracking-wider font-semibold text-[11px] px-2.5 py-1 bg-slate-800 rounded hidden lg:inline">
          {currentView}
        </span>

        {/* System Health Indicator */}
        <div className="flex items-center space-x-2 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              online ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
            }`}
          />
          <span className="text-slate-300 font-mono text-[11px] hidden sm:inline">
            {online ? `API v${health?.version || '0.1.0'}` : 'Offline Mode'}
          </span>
        </div>
      </div>
    </header>
  );
};
