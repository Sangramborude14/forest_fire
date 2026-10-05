import React from 'react';
import { SimulationStepProperties } from '../../../types/domain';
import { GeoJSONFeatureCollection, MultiPolygonGeometry } from '../../../types/geo';

export interface TimelineProps {
  stepsData: GeoJSONFeatureCollection<MultiPolygonGeometry, SimulationStepProperties> | null;
  currentStepIndex: number;
  onSelectStep: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({
  stepsData,
  currentStepIndex,
  onSelectStep,
  isPlaying,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  className = '',
}) => {
  const steps = stepsData?.features || [];
  const hasSteps = steps.length > 0;
  const currentStep = hasSteps ? steps[currentStepIndex]?.properties : null;

  return (
    <div
      className={`bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-xs select-none ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        {/* Playback Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onStepBackward}
            disabled={!hasSteps || currentStepIndex === 0}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Previous Step"
            aria-label="Previous Step"
          >
            ⏮
          </button>
          <button
            onClick={onTogglePlay}
            disabled={!hasSteps}
            className="w-8 h-8 rounded-lg bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            title={isPlaying ? 'Pause Simulation' : 'Play Timeline'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button
            onClick={onStepForward}
            disabled={!hasSteps || currentStepIndex >= steps.length - 1}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Next Step"
            aria-label="Next Step"
          >
            ⏭
          </button>

          <span className="text-slate-300 font-semibold ml-2">
            Simulation Progression
          </span>
        </div>

        {/* Current Timestep Telemetry */}
        <div className="flex items-center space-x-3 font-mono text-[11px]">
          {currentStep ? (
            <>
              <span className="text-slate-400">
                Burned: <strong className="text-rose-400">{currentStep.cumulative_burned_area_ha.toFixed(1)} ha</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 font-bold">
                T+{currentStep.elapsed_minutes}m (Step {currentStep.step_number})
              </span>
            </>
          ) : (
            <span className="text-slate-500 italic">No Active Timestep</span>
          )}
        </div>
      </div>

      {/* Scrub Range Slider */}
      {hasSteps ? (
        <div>
          <input
            type="range"
            min="0"
            max={steps.length - 1}
            value={currentStepIndex}
            onChange={(e) => onSelectStep(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>T+0h (Ignition)</span>
            <span>T+3h</span>
            <span>T+6h</span>
            <span>T+9h</span>
            <span>T+12h (Final Perimeter)</span>
          </div>
        </div>
      ) : (
        <div className="py-2 px-3 rounded-lg bg-slate-950/40 border border-dashed border-slate-800 text-center text-slate-500 text-[11px]">
          Timeline scrub disabled until a simulation job is executed.
        </div>
      )}
    </div>
  );
};
