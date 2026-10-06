import React, { useState } from 'react';
import { MapContainer } from '../features/map/components/MapContainer';
import { RegionLayer } from '../features/map/components/RegionLayer';
import { RiskLayer } from '../features/map/components/RiskLayer';
import { MapControls } from '../features/map/components/MapControls';
import { LayerControls } from '../features/map/components/LayerControls';
import { RiskLegend } from '../features/risk/components/RiskLegend';
import { RiskSummaryCard } from '../features/risk/components/RiskSummaryCard';
import { RiskDistributionChart } from '../features/risk/components/RiskDistributionChart';
import { RiskCellInspector } from '../features/risk/components/RiskCellInspector';
import { useRisk } from '../features/risk/hooks/useRisk';
import { RegionSummary, RiskPredictionProperties, IgnitionPoint } from '../types/domain';
import { GeoJSONFeature, PolygonGeometry, MultiPolygonGeometry } from '../types/geo';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import { ErrorAlert } from '../components/feedback/ErrorAlert';

export interface FireRiskPageProps {
  selectedRegion: RegionSummary | null;
  boundary: GeoJSONFeature<PolygonGeometry | MultiPolygonGeometry, RegionSummary> | null;
  onNavigateToSimulation?: (ignition: IgnitionPoint) => void;
}

export const FireRiskPage: React.FC<FireRiskPageProps> = ({
  selectedRegion,
  boundary,
  onNavigateToSimulation,
}) => {
  const [forecastDate, setForecastDate] = useState<string>('2026-10-06');
  const [activeSideTab, setActiveSideTab] = useState<'summary' | 'distribution'>('summary');

  const {
    riskData,
    rawRiskData,
    summary,
    selectedCell,
    setSelectedCell,
    selectedClassFilter,
    setSelectedClassFilter,
    isLoading,
    error,
    reload,
    recomputeRisk,
  } = useRisk(selectedRegion?.id, forecastDate);

  const handleFocusHighestRisk = () => {
    if (!rawRiskData?.features?.length) return;
    let highest = rawRiskData.features[0];
    for (const f of rawRiskData.features) {
      if (f.properties.risk_probability > highest.properties.risk_probability) {
        highest = f;
      }
    }
    setSelectedCell(highest.properties);
    setSelectedClassFilter('ALL');
  };

  const handleSimulateFromCell = (cell: RiskPredictionProperties) => {
    if (!onNavigateToSimulation) return;

    // Extract centroid coordinate from geometry if available
    let lat = 30.2104;
    let lon = 78.7523;

    const matchedFeature = rawRiskData?.features?.find(
      (f) => f.properties.cell_id === cell.cell_id
    );

    if (matchedFeature && matchedFeature.geometry.type === 'Polygon') {
      const ring = (matchedFeature.geometry as PolygonGeometry).coordinates[0];
      if (ring && ring.length > 0) {
        lon = ring.reduce((sum, p) => sum + p[0], 0) / ring.length;
        lat = ring.reduce((sum, p) => sum + p[1], 0) / ring.length;
      }
    }

    onNavigateToSimulation({ latitude: lat, longitude: lon });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Top Filter and Controls Bar */}
      <div className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex flex-wrap items-center justify-between shrink-0 text-xs z-10 gap-2">
        <div className="flex items-center space-x-2.5">
          <span className="font-semibold text-slate-300">24h Susceptibility Forecast:</span>
          <input
            type="date"
            value={forecastDate}
            onChange={(e) => setForecastDate(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-slate-200 font-mono text-xs focus:ring-1 focus:ring-amber-500"
          />
          <button
            onClick={recomputeRisk}
            disabled={isLoading || !selectedRegion}
            className="px-2.5 py-1 rounded bg-amber-600/90 hover:bg-amber-500 text-white font-medium text-[11px] transition-colors disabled:opacity-50 flex items-center space-x-1"
            title="Execute XGBoost risk inference for selected sector"
          >
            <span>⚡ Run Model</span>
          </button>
          <button
            onClick={handleFocusHighestRisk}
            disabled={isLoading || !summary}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-[11px] font-semibold transition-colors disabled:opacity-50"
            title="Locate cell with maximum predicted fire probability"
          >
            🎯 Focus Highest Risk
          </button>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400 text-[11px]">Filter:</span>
          {['ALL', 'EXTREME', 'HIGH', 'MODERATE', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedClassFilter(lvl)}
              className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
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
            <LoadingSpinner label="Running 500m XGBoost risk inference..." />
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
          <div className="absolute top-4 left-4 z-[400] flex flex-col space-y-2.5 pointer-events-auto max-w-xs">
            {/* Tab switch between Summary and Distribution Chart */}
            <div className="flex bg-slate-900/90 border border-slate-700/80 rounded-lg p-0.5 text-[11px]">
              <button
                onClick={() => setActiveSideTab('summary')}
                className={`flex-1 py-1 rounded text-center font-medium transition-colors ${
                  activeSideTab === 'summary'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveSideTab('distribution')}
                className={`flex-1 py-1 rounded text-center font-medium transition-colors ${
                  activeSideTab === 'distribution'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Chart
              </button>
            </div>

            {activeSideTab === 'summary' ? (
              <RiskSummaryCard summary={summary} isLoading={isLoading} />
            ) : (
              <RiskDistributionChart
                summary={summary}
                selectedFilter={selectedClassFilter}
                onSelectFilter={setSelectedClassFilter}
              />
            )}

            {selectedCell && (
              <RiskCellInspector
                cell={selectedCell}
                onClose={() => setSelectedCell(null)}
                onSimulateFromCell={handleSimulateFromCell}
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
