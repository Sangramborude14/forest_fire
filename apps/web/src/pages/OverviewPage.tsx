import React from 'react';
import { MetricGrid } from '../features/dashboard/components/MetricGrid';
import { SystemStatusBanner } from '../features/dashboard/components/SystemStatusBanner';
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

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
      {/* Top Metric Summary Ribbon */}
      <div className="p-4 bg-slate-900/60 border-b border-slate-800 shrink-0 space-y-3">
        <MetricGrid
          regionCount={regions.length}
          activeFireCount={activeFireCount}
          meanRisk={meanRisk}
          gridCells={gridCells}
        />
        <SystemStatusBanner health={null} online={true} />
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
            <div className="font-semibold text-slate-100 flex items-center space-x-1.5">
              <span>📍</span>
              <span>{selectedRegion?.name || 'Garhwal Western Himalaya'}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Active operational sector. 500m normalized grid active with multi-source observation feeds.
            </p>
            <div className="flex space-x-2 pt-1 border-t border-slate-800">
              <button
                onClick={() => onNavigateTab('risk')}
                className="flex-1 px-2.5 py-1.5 rounded-lg bg-amber-600/30 border border-amber-500/50 text-amber-400 font-semibold hover:bg-amber-600/40 text-[11px] transition-colors"
              >
                Inspect 24h Risk →
              </button>
              <button
                onClick={() => onNavigateTab('simulation')}
                className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-semibold hover:bg-slate-700 text-[11px] transition-colors"
              >
                Simulate Spread →
              </button>
            </div>
          </div>
        </MapContainer>
      </div>
    </div>
  );
};
