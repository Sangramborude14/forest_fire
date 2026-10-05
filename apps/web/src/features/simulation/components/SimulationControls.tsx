import React from 'react';
import { Button } from '../../../components/ui/Button';

export interface SimulationControlsProps {
  durationHours: number;
  onDurationChange: (hours: number) => void;
  stepMinutes: number;
  onStepMinutesChange: (minutes: number) => void;
  hasIgnition: boolean;
  isSubmitting?: boolean;
  onStartSimulation: () => void;
  className?: string;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  durationHours,
  onDurationChange,
  stepMinutes,
  onStepMinutesChange,
  hasIgnition,
  isSubmitting = false,
  onStartSimulation,
  className = '',
}) => {
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

      {/* Submit Run Button */}
      <div className="pt-2">
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
        {!hasIgnition && (
          <p className="text-[10px] text-amber-400/80 text-center mt-1.5">
            Select an ignition point to begin simulation.
          </p>
        )}
      </div>
    </div>
  );
};
