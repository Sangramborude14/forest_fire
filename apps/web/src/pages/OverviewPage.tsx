import React from 'react';
import { MetricGrid } from '../features/dashboard/components/MetricGrid';
import { OperationalAttentionBanner } from '../features/dashboard/components/OperationalAttentionBanner';
import { MapContainer } from '../features/map/components/MapContainer';
import { RegionLayer } from '../features/map/components/RegionLayer';
import { FireLayer } from '../features/map/components/FireLayer';
import { RiskLayer } from '../features/map/components/RiskLayer';
import { MapControls } from '../features/map/components/MapControls';
import { LayerControls } from '../features/map/components/LayerControls';
import { MapLegend } from '../features/map/components/MapLegend';
import { useActiveFires } from '../features/fire/hooks/useActiveFires';
import { useRisk } from '../features/risk/hooks/useRisk';
import { RegionSummary } from '../types/domain';
import { GeoJSONFeature, PolygonGeometry, MultiPolygonGeometry } from '../types/geo';
import { NavTab } from '../components/layout/Navigation';

export interface OverviewPageProps {
  regions: RegionSummary[];
  selectedRegion: RegionSummary | null;
  boundary: GeoJSONFeature<PolygonGeometry | MultiPolygonGeometry, RegionSummary> | null;
  onNavigateTab: (tab: NavTab) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  regions,
  selectedRegion,
  boundary,
  onNavigateTab,
}) => {
  const { filteredFeatures, totalCount: activeFireCount } = useActiveFires(selectedRegion?.id);
  const { riskData, summary: riskSummary } = useRisk(selectedRegion?.id);

  const meanRisk = riskSummary?.mean_probability || 0.28;
  const gridCells = riskSummary?.total_cells || 11362;
  const highRiskCells = riskSummary?.high_risk_cells || 0;
  const extremeRiskCells = riskSummary?.extreme_risk_cells || 0;
  const maxRisk = riskSummary?.max_probability || 0;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
      {/* Top Metric Summary Ribbon & Operational Attention */}
      <div className="p-3.5 bg-slate-900/70 border-b border-slate-800 shrink-0 space-y-2.5">
        <MetricGrid
          regionCount={regions.length}
          activeFireCount={activeFireCount}
          meanRisk={meanRisk}
          gridCells={gridCells}
          highRiskCount={highRiskCells + extremeRiskCells}
          maxRisk={maxRisk}
        />
        <OperationalAttentionBanner
          regionName={selectedRegion?.name}
          activeFireCount={activeFireCount}
          highRiskCellCount={highRiskCells}
          extremeRiskCellCount={extremeRiskCells}
          maxProbability={maxRisk}
          forecastDate={riskSummary?.target_date}
          onNavigateTab={onNavigateTab}
        />
      </div>

      {/* Main Interactive Overview GIS Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <MapContainer>
          {/* Spatial Layers */}
          <RegionLayer boundaryFeature={boundary} />
          <RiskLayer riskData={riskData} />
          <FireLayer
            firesData={
              filteredFeatures.length > 0
                ? { type: 'FeatureCollection', features: filteredFeatures }
                : null
            }
          />

          {/* Floating Controls */}
          <div className="absolute top-4 right-4 z-[400] flex flex-col space-y-2 pointer-events-auto">
            <LayerControls />
            <MapControls />
          </div>

          {/* Floating Legend */}
          <div className="absolute bottom-6 left-4 z-[400] pointer-events-auto">
            <MapLegend />
          </div>

          {/* Quick Action Navigation Card */}
          <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 border border-slate-700/80 rounded-xl p-3.5 shadow-xl backdrop-blur-md text-xs pointer-events-auto max-w-xs space-y-2.5">
            <div className="font-semibold text-slate-100 flex items-center justify-between">
              <span className="flex items-center space-x-1.5 truncate">
                <span>📍</span>
                <span className="truncate">{selectedRegion?.name || 'Garhwal Western Himalaya'}</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                {selectedRegion?.code || 'SECTOR'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Operational sector view. 500m grid active with automated satellite thermal hotspot overlay.
            </p>
            <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-800">
              <button
                onClick={() => onNavigateTab('risk')}
                className="px-2 py-1.5 rounded-lg bg-amber-600/30 border border-amber-500/50 text-amber-400 font-semibold hover:bg-amber-600/40 text-[10px] transition-colors text-center"
              >
                24h Risk →
              </button>
              <button
                onClick={() => onNavigateTab('active_fires')}
                className="px-2 py-1.5 rounded-lg bg-rose-600/30 border border-rose-500/50 text-rose-300 font-semibold hover:bg-rose-600/40 text-[10px] transition-colors text-center"
              >
                Fires ({activeFireCount}) →
              </button>
              <button
                onClick={() => onNavigateTab('simulation')}
                className="px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-semibold hover:bg-slate-700 text-[10px] transition-colors text-center"
              >
                Simulate →
              </button>
            </div>
          </div>
        </MapContainer>
      </div>
    </div>
  );
};
