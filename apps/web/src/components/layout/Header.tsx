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
  const [currentTime, setCurrentTime] = useState<string>(() => {
    const now = new Date();
    return `${now.toISOString().slice(11, 19)} UTC · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Local`;
  });

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

    if (import.meta.env?.MODE !== 'test') {
      const timer = setInterval(() => {
        if (mounted) {
          const now = new Date();
          setCurrentTime(
            `${now.toISOString().slice(11, 19)} UTC · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Local`
          );
        }
      }, 1000);

      return () => {
        mounted = false;
        clearInterval(timer);
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 sm:px-5 select-none shrink-0 z-30">
      {/* Brand & Title */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center font-bold text-white shadow-md text-base">
          🔥
        </div>
        <div>
          <h1 className="font-semibold text-xs sm:text-sm text-slate-100 tracking-wide flex items-center space-x-2">
            <span>ISRO Forest Fire Platform</span>
            <span className="hidden lg:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800">
              500m Grid
            </span>
          </h1>
          <p className="text-[10px] text-slate-400 hidden sm:block">
            Predictive Susceptibility & 12h Spread Simulation
          </p>
        </div>
      </div>

      {/* Clock & Data Freshness Indicator */}
      <div className="hidden xl:flex items-center space-x-3 font-mono text-[11px] text-slate-400 bg-slate-950/60 px-3 py-1 rounded-lg border border-slate-800">
        <span className="text-slate-300">🕒 {currentTime}</span>
        <span className="text-slate-600">|</span>
        <span className="text-amber-400/90 font-medium">24h Horizon Forecast</span>
      </div>

      {/* Region Selector & Status */}
      <div className="flex items-center space-x-2.5">
        <RegionSelector
          regions={regions}
          selectedRegionId={selectedRegionId}
          onSelectRegion={onSelectRegion}
          isLoading={isLoadingRegions}
        />

        {/* Current View Pill */}
        <span className="text-slate-300 uppercase tracking-wider font-semibold text-[10px] px-2.5 py-1 bg-slate-800 rounded hidden md:inline border border-slate-700">
          {currentView}
        </span>

        {/* System Health Indicator */}
        <div
          className="flex items-center space-x-2 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700 text-xs"
          title={`Backend Services: PostGIS (${health?.services?.database || 'OK'}), Celery (${health?.services?.celery_broker || 'OK'}), Models (Online)`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              online ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
            }`}
          />
          <span className="text-slate-300 font-mono text-[11px] hidden sm:inline">
            {online ? `System Operational` : 'Offline Mode'}
          </span>
        </div>
      </div>
    </header>
  );
};
