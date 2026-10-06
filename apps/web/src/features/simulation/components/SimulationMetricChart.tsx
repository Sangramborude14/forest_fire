import React from 'react';
import { SimulationStepProperties } from '../../../types/domain';
import { GeoJSONFeatureCollection, MultiPolygonGeometry } from '../../../types/geo';

export interface SimulationMetricChartProps {
  stepsData: GeoJSONFeatureCollection<MultiPolygonGeometry, SimulationStepProperties> | null;
  currentStepIndex: number;
  onSelectStep?: (index: number) => void;
  className?: string;
}

export const SimulationMetricChart: React.FC<SimulationMetricChartProps> = ({
  stepsData,
  currentStepIndex,
  onSelectStep,
  className = '',
}) => {
  const steps = stepsData?.features || [];

  if (steps.length === 0) {
    return (
      <div
        className={`bg-slate-900/95 border border-slate-700/80 rounded-xl p-4 shadow-xl backdrop-blur-md text-xs ${className}`}
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="font-semibold text-slate-200">Spread Analytics</span>
          <span className="text-[10px] text-slate-500 font-mono">12h Simulation</span>
        </div>
        <p className="py-4 text-center text-slate-500 text-[11px] italic">
          Run or load a simulation to view cumulative burned area and spread velocity analytics.
        </p>
      </div>
    );
  }

  // Calculate maximum values for scaling
  const maxArea = Math.max(...steps.map((s) => s.properties.cumulative_burned_area_ha || 0), 10);
  const maxVelocity = Math.max(...steps.map((s) => s.properties.spread_velocity_kmh || 0), 1);

  const selectedStep = steps[currentStepIndex]?.properties;

  return (
    <div
      className={`bg-slate-900/95 border border-slate-700/80 rounded-xl p-4 shadow-xl backdrop-blur-md text-xs ${className}`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-amber-400 font-bold">📈 Spread Metrics</span>
          <span className="text-[10px] font-mono text-slate-400">
            {steps.length} Timesteps
          </span>
        </div>
        {selectedStep && (
          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <span className="text-rose-400">
              {selectedStep.cumulative_burned_area_ha.toFixed(1)} ha
            </span>
            {selectedStep.spread_velocity_kmh !== undefined && (
              <span className="text-amber-300">
                {selectedStep.spread_velocity_kmh.toFixed(1)} km/h
              </span>
            )}
          </div>
        )}
      </div>

      {/* Legend & Instructions */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 px-1">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/80 inline-block" />
            <span>Cumulative Area (ha)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span>Velocity (km/h)</span>
          </span>
        </div>
        <span className="text-slate-500 hidden sm:inline">Click bar to inspect step</span>
      </div>

      {/* Responsive Bar & Point Visualizer */}
      <div className="h-32 flex items-end space-x-1.5 pt-3 pb-1 px-1 bg-slate-950/40 rounded-lg border border-slate-800/80">
        {steps.map((step, idx) => {
          const props = step.properties;
          const area = props.cumulative_burned_area_ha || 0;
          const velocity = props.spread_velocity_kmh || 0;

          const areaPct = Math.min(100, Math.max(8, (area / maxArea) * 100));
          const velocityPct = Math.min(100, Math.max(5, (velocity / maxVelocity) * 100));
          const isSelected = idx === currentStepIndex;

          const hourLabel =
            props.step_hour !== undefined
              ? `T+${props.step_hour}h`
              : props.elapsed_minutes !== undefined
              ? `T+${Math.round(props.elapsed_minutes / 60)}h`
              : `S${props.step_number}`;

          return (
            <button
              key={idx}
              onClick={() => onSelectStep?.(idx)}
              className={`flex-1 h-full flex flex-col justify-end items-center group relative focus:outline-none transition-all ${
                isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
              title={`${hourLabel}: ${area.toFixed(1)} ha, ${velocity.toFixed(1)} km/h`}
              aria-label={`Step ${idx}: ${hourLabel}`}
            >
              {/* Selected indicator indicator line */}
              {isSelected && (
                <div className="absolute -top-1 w-full flex justify-center">
                  <div className="w-2 h-2 rotate-45 bg-amber-400 shadow-sm shadow-amber-500" />
                </div>
              )}

              {/* Bar column */}
              <div className="w-full max-w-[24px] relative flex flex-col justify-end items-center h-full">
                {/* Area Bar */}
                <div
                  style={{ height: `${areaPct}%` }}
                  className={`w-full rounded-t transition-all ${
                    isSelected
                      ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                      : 'bg-rose-500/60 group-hover:bg-rose-500/80'
                  }`}
                />

                {/* Velocity Marker Dot */}
                <div
                  style={{ bottom: `${velocityPct}%` }}
                  className={`absolute w-2 h-2 rounded-full border border-slate-900 pointer-events-none transition-all ${
                    isSelected
                      ? 'bg-amber-300 ring-2 ring-amber-400'
                      : 'bg-amber-400/90'
                  }`}
                />
              </div>

              {/* Step Label */}
              <span
                className={`text-[9px] font-mono mt-1 ${
                  isSelected ? 'text-amber-300 font-bold' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {hourLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Axis Summary Footer */}
      <div className="mt-2 flex justify-between items-center text-[10px] font-mono text-slate-500 px-1">
        <span>Max Area: {maxArea.toFixed(1)} ha</span>
        <span>Peak Rate: {maxVelocity.toFixed(1)} km/h</span>
      </div>
    </div>
  );
};
