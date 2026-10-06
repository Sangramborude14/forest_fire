import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';

export interface SimulationControlsProps {
  durationHours: number;
  onDurationChange: (hours: number) => void;
  stepMinutes: number;
  onStepMinutesChange: (minutes: number) => void;
  windSpeedMs?: number;
  onWindSpeedChange?: (speed: number) => void;
  windDirectionDeg?: number;
  onWindDirectionChange?: (deg: number) => void;
  fuelType?: string;
  onFuelTypeChange?: (fuel: string) => void;
  hasIgnition: boolean;
  isSubmitting?: boolean;
  onStartSimulation: () => void;
  onClearIgnition?: () => void;
  hasCompletedSimulation?: boolean;
  onReplaySimulation?: () => void;
  className?: string;
}

function getCardinalDirection(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round((deg % 360) / 45) % 8;
  return directions[index];
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  durationHours,
  onDurationChange,
  stepMinutes,
  onStepMinutesChange,
  windSpeedMs = 7.5,
  onWindSpeedChange,
  windDirectionDeg = 225,
  onWindDirectionChange,
  fuelType = 'CONIFER_HIGH_FLAMMABILITY',
  onFuelTypeChange,
  hasIgnition,
  isSubmitting = false,
  onStartSimulation,
  onClearIgnition,
  hasCompletedSimulation = false,
  onReplaySimulation,
  className = '',
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const windKmh = (windSpeedMs * 3.6).toFixed(1);

  return (
    <div
      className={`bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs space-y-3.5 ${className}`}
    >
      <div className="font-semibold text-slate-200 pb-2 border-b border-slate-800 flex items-center justify-between">
        <span className="flex items-center space-x-1.5">
          <span>⚙️</span>
          <span>Simulation Parameters</span>
        </span>
        <span className="text-[10px] font-mono text-slate-400">Cellular Automata</span>
      </div>

      {/* Duration Selector */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-slate-300 font-medium">Spread Horizon:</span>
          <span className="font-mono font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {durationHours} Hours
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="12"
          step="1"
          value={durationHours}
          onChange={(e) => onDurationChange(parseInt(e.target.value, 10))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>1h</span>
          <span>3h</span>
          <span>6h</span>
          <span>9h</span>
          <span>12h Max</span>
        </div>
      </div>

      {/* Step Interval */}
      <div className="space-y-1.5">
        <label className="text-slate-300 font-medium text-[11px] block">
          Perimeter Output Interval:
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[15, 30, 60].map((interval) => (
            <button
              key={interval}
              type="button"
              onClick={() => onStepMinutesChange(interval)}
              className={`py-1.5 rounded text-[11px] font-mono font-semibold transition-colors border ${
                stepMinutes === interval
                  ? 'bg-amber-600/30 border-amber-500 text-amber-400'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {interval} min
            </button>
          ))}
        </div>
      </div>

      {/* Weather & Environmental Scenario Overrides Toggle */}
      <div className="pt-1 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-200 py-1 transition-colors"
        >
          <span className="flex items-center space-x-1.5">
            <span>🌬️</span>
            <span className="font-medium">Weather & Fuel Overrides</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {showAdvanced ? '▲ Hide' : '▼ Adjust'}
          </span>
        </button>

        {showAdvanced && (
          <div className="mt-2.5 space-y-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
            {/* Wind Speed */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">Wind Speed:</span>
                <span className="font-mono text-amber-400">
                  {windSpeedMs} m/s ({windKmh} km/h)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                value={windSpeedMs}
                onChange={(e) =>
                  onWindSpeedChange && onWindSpeedChange(parseFloat(e.target.value))
                }
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Wind Direction */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">Wind Direction:</span>
                <span className="font-mono text-amber-400">
                  {windDirectionDeg}° ({getCardinalDirection(windDirectionDeg)})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={windDirectionDeg}
                onChange={(e) =>
                  onWindDirectionChange && onWindDirectionChange(parseInt(e.target.value, 10))
                }
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Fuel Type */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 block">Fuel Classification:</span>
              <select
                value={fuelType}
                onChange={(e) => onFuelTypeChange && onFuelTypeChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="CONIFER_HIGH_FLAMMABILITY">Conifer Forest (High)</option>
                <option value="PINE_MODERATE_FLAMMABILITY">Pine Forest (Moderate)</option>
                <option value="DECIDUOUS_LOW_FLAMMABILITY">Deciduous (Low)</option>
                <option value="GRASSLAND_RAPID_SPREAD">Dry Grassland (Rapid)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 space-y-2">
        <Button
          variant="primary"
          size="md"
          className="w-full font-semibold"
          disabled={!hasIgnition || isSubmitting}
          isLoading={isSubmitting}
          onClick={onStartSimulation}
        >
          {isSubmitting ? 'Dispatching Job...' : 'Initialize 12h Simulation'}
        </Button>

        {hasCompletedSimulation && onReplaySimulation && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full font-mono text-[11px]"
            onClick={onReplaySimulation}
          >
            🔁 Replay Simulation
          </Button>
        )}

        {hasIgnition && onClearIgnition && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full font-mono text-[10px] text-slate-400 hover:text-rose-400"
            onClick={onClearIgnition}
          >
            ✕ Reset Ignition Point
          </Button>
        )}

        {!hasIgnition && (
          <p className="text-[10px] text-amber-400/80 text-center mt-1.5">
            Select an ignition point to begin simulation.
          </p>
        )}
      </div>
    </div>
  );
};
