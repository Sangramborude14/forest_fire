import React from 'react';
import { MapContainer } from '../features/map/components/MapContainer';
import { RegionLayer } from '../features/map/components/RegionLayer';
import { SimulationLayer } from '../features/map/components/SimulationLayer';
import { MapControls } from '../features/map/components/MapControls';
import { LayerControls } from '../features/map/components/LayerControls';
import { IgnitionSelector } from '../features/simulation/components/IgnitionSelector';
import { SimulationControls } from '../features/simulation/components/SimulationControls';
import { Timeline } from '../features/simulation/components/Timeline';
import { SimulationStatus } from '../features/simulation/components/SimulationStatus';
import { useSimulation } from '../features/simulation/hooks/useSimulation';
import { RegionSummary } from '../types/domain';
import { GeoJSONFeature, PolygonGeometry, MultiPolygonGeometry } from '../types/geo';
import { ErrorAlert } from '../components/feedback/ErrorAlert';

export interface SimulationPageProps {
  selectedRegion: RegionSummary | null;
  boundary: GeoJSONFeature<PolygonGeometry | MultiPolygonGeometry, RegionSummary> | null;
}

export const SimulationPage: React.FC<SimulationPageProps> = ({
  selectedRegion,
  boundary,
}) => {
  const {
    ignitionPoint,
    setIgnitionPoint,
    durationHours,
    setDurationHours,
    stepMinutes,
    setStepMinutes,
    activeJob,
    simulationDetail,
    stepsData,
    currentStepIndex,
    setCurrentStepIndex,
    isPlaying,
    setIsPlaying,
    isSubmitting,
    error,
    startSimulation,
    clearIgnition,
    stepForward,
    stepBackward,
  } = useSimulation(selectedRegion?.id || 'reg-01');

  const handleMapClick = (lat: number, lng: number) => {
    setIgnitionPoint({ latitude: lat, longitude: lng });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Simulation Ribbon */}
      <div className="h-12 bg-slate-900 border-b border-slate-800 px-5 flex items-center justify-between shrink-0 text-xs z-10 font-mono">
        <div className="flex items-center space-x-3">
          <span className="text-slate-400">Simulation Engine:</span>
          <span className="text-amber-400 font-semibold">12-Hour Cellular Automata</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
            {activeJob ? activeJob.status : 'Ready for Dispatch'}
          </span>
        </div>

        <div className="text-slate-400 text-[11px] hidden md:block">
          Click map to establish ignition coordinates.
        </div>
      </div>

      {/* Main Split Layout: Map + Controls */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Map Viewport */}
        <div className="flex-1 relative overflow-hidden">
          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4">
              <ErrorAlert
                title="Simulation Dispatch Warning"
                message={error}
              />
            </div>
          )}

          <MapContainer onMapClick={handleMapClick}>
            <RegionLayer boundaryFeature={boundary} />
            <SimulationLayer
              ignitionPoint={ignitionPoint}
              perimeterData={stepsData}
              currentStepIndex={currentStepIndex}
            />

            {/* Floating Controls */}
            <div className="absolute top-4 right-4 z-[400] flex flex-col space-y-2 pointer-events-auto">
              <LayerControls />
              <MapControls />
            </div>

            {/* Floating 12-Hour Timeline Slider at bottom */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] w-full max-w-2xl px-4 pointer-events-auto">
              <Timeline
                stepsData={stepsData}
                currentStepIndex={currentStepIndex}
                onSelectStep={setCurrentStepIndex}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(!isPlaying)}
                onStepForward={stepForward}
                onStepBackward={stepBackward}
              />
            </div>
          </MapContainer>
        </div>

        {/* Right Simulation Parameters Sidebar */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 p-4 flex flex-col space-y-4 shrink-0 z-10 overflow-y-auto">
          <IgnitionSelector
            ignitionPoint={ignitionPoint}
            onSetIgnition={setIgnitionPoint}
            onClearIgnition={clearIgnition}
          />

          <SimulationControls
            durationHours={durationHours}
            onDurationChange={setDurationHours}
            stepMinutes={stepMinutes}
            onStepMinutesChange={setStepMinutes}
            hasIgnition={!!ignitionPoint}
            isSubmitting={isSubmitting}
            onStartSimulation={() => startSimulation('Interactive Spread Run')}
          />

          {(activeJob || simulationDetail) && (
            <SimulationStatus job={activeJob} detail={simulationDetail} />
          )}
        </div>
      </div>
    </div>
  );
};
