import React, { useState } from 'react';
import { useMapContext } from '../hooks/useMapContext';
import { APP_CONFIG } from '../../../app/config';

export interface MapLegendProps {
  className?: string;
}

export const MapLegend: React.FC<MapLegendProps> = ({ className = '' }) => {
  const { activeLayers } = useMapContext();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Check if at least one layer with a legend is active
  const hasActiveLegends =
    activeLayers.riskChoropleth ||
    activeLayers.activeFires ||
    activeLayers.simulationPerimeter;

  if (!hasActiveLegends) return null;

  return (
    <div
      className={`z-[400] bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden transition-all text-xs select-none ${
        isCollapsed ? 'w-auto' : 'w-60'
      } ${className}`}
    >
      <div
        className="px-3 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center space-x-1.5 font-semibold text-slate-200">
          <span>🗺️</span>
          <span>Map Legend</span>
        </div>
        <span className="text-[10px] text-slate-400">{isCollapsed ? '▲' : '▼'}</span>
      </div>

      {!isCollapsed && (
        <div className="p-3 space-y-3 max-h-72 overflow-y-auto">
          {/* Risk Legend */}
          {activeLayers.riskChoropleth && (
            <div>
              <div className="font-semibold text-slate-300 text-[11px] mb-1.5 flex items-center justify-between">
                <span>24h Risk Susceptibility</span>
                <span className="text-[9px] font-mono text-slate-500">500m Grid</span>
              </div>
              <div className="space-y-1 font-mono text-[10px]">
                {Object.entries(APP_CONFIG.riskColors).map(([key, config]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <span
                        className="w-2.5 h-2.5 rounded-sm shrink-0 border border-black/30"
                        style={{ backgroundColor: config.fillColor }}
                      />
                      <span className="text-slate-300 capitalize">{config.label}</span>
                    </span>
                    <span className="text-slate-500">{config.threshold}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Fires Legend */}
          {activeLayers.activeFires && (
            <div className="pt-2 border-t border-slate-800">
              <div className="font-semibold text-slate-300 text-[11px] mb-1.5 flex items-center justify-between">
                <span>Thermal Hotspots</span>
                <span className="text-[9px] font-mono text-slate-500">FIRMS</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-white shrink-0" />
                  <span className="text-slate-300">High Confidence (&gt;50 MW FRP)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 border border-white shrink-0" />
                  <span className="text-slate-300">Nominal Confidence Hotspot</span>
                </div>
              </div>
            </div>
          )}

          {/* Simulation Legend */}
          {activeLayers.simulationPerimeter && (
            <div className="pt-2 border-t border-slate-800">
              <div className="font-semibold text-slate-300 text-[11px] mb-1.5 flex items-center justify-between">
                <span>12h Spread Simulation</span>
                <span className="text-[9px] font-mono text-slate-500">CA Engine</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <div className="flex items-center space-x-2">
                  <span className="text-xs">🎯</span>
                  <span className="text-slate-300">Ignition Origin Point</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-1.5 bg-rose-500/70 border border-rose-400 shrink-0" />
                  <span className="text-slate-300">Active Fire Front</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-1.5 bg-orange-500/30 border border-orange-400 border-dashed shrink-0" />
                  <span className="text-slate-300">Cumulative Burn Scar</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
