import React, { useState } from 'react';
import { MapContainer } from '../features/map/MapContainer';

export const SimulationPage: React.FC = () => {
  const [currentHour, setCurrentHour] = useState<number>(3);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Simulation Telemetry Ribbon */}
      <div className="h-12 bg-slate-900 border-b border-slate-800 px-5 flex items-center justify-between shrink-0 text-xs z-10 font-mono">
        <div className="flex items-center space-x-4">
          <span className="text-slate-400">Simulation:</span>
          <span className="text-amber-400 font-semibold">Job #99e1234a (12h CA)</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px]">
            COMPLETED
          </span>
        </div>

        <div className="flex items-center space-x-6 text-slate-300">
          <div>
            <span className="text-slate-500 mr-1.5">Burned Area:</span>
            <span className="font-bold text-slate-100">{(currentHour * 34.2).toFixed(1)} ha</span>
          </div>
          <div>
            <span className="text-slate-500 mr-1.5">Front Velocity:</span>
            <span className="font-bold text-slate-100">{(0.8 + currentHour * 0.05).toFixed(2)} km/h</span>
          </div>
          <div>
            <span className="text-slate-500 mr-1.5">Heading:</span>
            <span className="font-bold text-amber-400">65.0° ENE</span>
          </div>
        </div>
      </div>

      {/* Map Canvas with Simulation Perimeter */}
      <div className="flex-1 relative overflow-hidden">
        <MapContainer activeLayer="simulation" simulationHour={currentHour}>
          {/* Floating 12-Hour Timeline Slider Control */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md w-full max-w-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-7 h-7 rounded-full bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center font-bold text-xs transition-colors"
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <span className="text-xs font-semibold text-slate-200">
                  Progression Timestep:
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                Hour {currentHour} of 12
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="12"
              value={currentHour}
              onChange={(e) => setCurrentHour(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>T+0h (Ignition)</span>
              <span>T+3h</span>
              <span>T+6h</span>
              <span>T+9h</span>
              <span>T+12h (Final)</span>
            </div>
          </div>
        </MapContainer>
      </div>
    </div>
  );
};
