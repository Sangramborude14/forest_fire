import React, { useState } from 'react';
import { MapContainer } from '../features/map/components/MapContainer';
import { RegionLayer } from '../features/map/components/RegionLayer';
import { RiskLayer } from '../features/map/components/RiskLayer';
import { MapControls } from '../features/map/components/MapControls';
import { LayerControls } from '../features/map/components/LayerControls';
import { RiskLegend } from '../features/risk/components/RiskLegend';
import { RiskSummaryCard } from '../features/risk/components/RiskSummaryCard';
import { RiskCellInspector } from '../features/risk/components/RiskCellInspector';
import { useRisk } from '../features/risk/hooks/useRisk';
import { RegionSummary, RiskPredictionProperties } from '../types/domain';
import { GeoJSONFeature, PolygonGeometry, MultiPolygonGeometry } from '../types/geo';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import { ErrorAlert } from '../components/feedback/ErrorAlert';

export interface FireRiskPageProps {
  selectedRegion: RegionSummary | null;
  boundary: GeoJSONFeature<PolygonGeometry | MultiPolygonGeometry, RegionSummary> | null;
}

export const FireRiskPage: React.FC<FireRiskPageProps> = ({
  selectedRegion,
  boundary,
}) => {
  const [forecastDate, setForecastDate] = useState<string>('2026-10-06');
  const {
    riskData,
    summary,
    selectedCell,
    setSelectedCell,
    selectedClassFilter,
    setSelectedClassFilter,
    isLoading,
    error,
    reload,
  } = useRisk(selectedRegion?.id, forecastDate);

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
            className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-slate-200 font-mono text-xs focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Filter Level:</span>
          {['ALL', 'EXTREME', 'HIGH', 'MODERATE', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedClassFilter(lvl)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                selectedClassFilter === lvl
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Canvas */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-30 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center">
            <LoadingSpinner label="Loading 500m risk predictions..." />
          </div>
        )}

        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4">
            <ErrorAlert
              title="Risk Prediction Service Unavailable"
              message={error}
              onRetry={reload}
            />
          </div>
        )}

        <MapContainer>
          <RegionLayer boundaryFeature={boundary} />
          <RiskLayer
            riskData={riskData}
            selectedCellId={selectedCell?.cell_id}
            onSelectCell={(cellProps: RiskPredictionProperties) => setSelectedCell(cellProps)}
          />

          {/* Floating Controls */}
          <div className="absolute top-4 right-4 z-[400] flex flex-col space-y-2 pointer-events-auto">
            <LayerControls />
            <MapControls />
          </div>

          {/* Left Floating Info Panels */}
          <div className="absolute top-4 left-4 z-[400] flex flex-col space-y-3 pointer-events-auto max-w-xs">
            <RiskSummaryCard summary={summary} isLoading={isLoading} />
            {selectedCell && (
              <RiskCellInspector
                cell={selectedCell}
                onClose={() => setSelectedCell(null)}
              />
            )}
          </div>

          {/* Bottom Left Legend */}
          <div className="absolute bottom-6 left-4 z-[400] pointer-events-auto">
            <RiskLegend />
          </div>
        </MapContainer>
      </div>
    </div>
  );
};
