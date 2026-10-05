import React, { useState } from 'react';
import { MapContainer } from '../features/map/MapContainer';

export const FireRiskPage: React.FC = () => {
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [forecastDate, setForecastDate] = useState<string>('2026-10-06');

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Top Filter and Controls Bar */}
      <div className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 text-xs z-10">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-300">24h Susceptibility Forecast:</span>
          <input
            type="date"
            value={forecastDate}
            onChange={(e) => setForecastDate(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:ring-0"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Filter Level:</span>
          {['ALL', 'EXTREME', 'HIGH', 'MODERATE', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedRisk(lvl)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                selectedRisk === lvl
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Map with Risk Layer Overlay */}
      <div className="flex-1 relative overflow-hidden">
        <MapContainer activeLayer="risk">
          {/* Floating Risk Legend Box */}
          <div className="absolute bottom-10 left-4 z-20 bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs w-56">
            <h4 className="font-semibold text-slate-200 mb-2">Susceptibility Scale</h4>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-rose-500" />
                  <span className="text-slate-300">Extreme</span>
                </span>
                <span className="text-slate-400">0.75 - 1.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-orange-500" />
                  <span className="text-slate-300">High</span>
                </span>
                <span className="text-slate-400">0.50 - 0.75</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-amber-500" />
                  <span className="text-slate-300">Moderate</span>
                </span>
                <span className="text-slate-400">0.25 - 0.50</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-emerald-500" />
                  <span className="text-slate-300">Low</span>
                </span>
                <span className="text-slate-400">0.00 - 0.25</span>
              </div>
            </div>
          </div>
        </MapContainer>
      </div>
    </div>
  );
};
