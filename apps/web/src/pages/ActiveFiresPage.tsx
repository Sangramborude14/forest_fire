import React from 'react';
import { MapContainer } from '../features/map/MapContainer';

export const ActiveFiresPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <div className="h-12 bg-slate-900 border-b border-slate-800 px-5 flex items-center justify-between shrink-0 text-xs z-10">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-300">Satellite Sensor Feeds:</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
            VIIRS NOAA-20 / MODIS Aqua-Terra
          </span>
        </div>
        <div className="flex items-center space-x-2 text-slate-400">
          <span>Acquisition Window:</span>
          <span className="text-amber-400 font-mono font-medium">Last 24 Hours</span>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <MapContainer activeLayer="fires">
          {/* Active Hotspot Telemetry Card */}
          <div className="absolute top-4 left-4 z-20 bg-slate-900/95 border border-slate-700/80 rounded-xl p-4 shadow-xl backdrop-blur-md text-xs w-72">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-rose-400 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Thermal Anomaly</span>
              </span>
              <span className="font-mono text-[10px] text-slate-400">88% Confidence</span>
            </div>
            <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Coordinates:</span>
                <span>30.2104°N, 78.7523°E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Radiative Power:</span>
                <span className="text-amber-400">42.1 MW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Brightness Temp:</span>
                <span>348.6 K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Acquisition:</span>
                <span>14:30 UTC</span>
              </div>
            </div>
          </div>
        </MapContainer>
      </div>
    </div>
  );
};
