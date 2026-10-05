import React from 'react';
import { MapContainer } from '../features/map/components/MapContainer';
import { RegionLayer } from '../features/map/components/RegionLayer';
import { MapControls } from '../features/map/components/MapControls';
import { LayerControls } from '../features/map/components/LayerControls';
import { LayerManager } from '../features/layers/components/LayerManager';
import { useLayers } from '../features/layers/hooks/useLayers';
import { RegionSummary } from '../types/domain';
import { GeoJSONFeature, PolygonGeometry, MultiPolygonGeometry } from '../types/geo';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import { ErrorAlert } from '../components/feedback/ErrorAlert';

export interface LayersPageProps {
  selectedRegion: RegionSummary | null;
  boundary: GeoJSONFeature<PolygonGeometry | MultiPolygonGeometry, RegionSummary> | null;
}

export const LayersPage: React.FC<LayersPageProps> = ({
  selectedRegion,
  boundary,
}) => {
  const {
    layers,
    selectedLayerId,
    setSelectedLayerId,
    selectedLayer,
    isLoading,
    error,
    reload,
  } = useLayers();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Top Header */}
      <div className="h-12 bg-slate-900 border-b border-slate-800 px-5 flex items-center justify-between shrink-0 text-xs z-10">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-300">Environmental & Terrain Catalog:</span>
          <span className="text-slate-400 font-mono text-[11px]">
            ISRO Bhuvan / CartoDEM / IMD ERA5 / FIRMS
          </span>
        </div>

        <div className="text-slate-400 font-mono text-[11px]">
          Sector: {selectedRegion?.name || 'Western Himalaya'} | 500m Normalized Rasters
        </div>
      </div>

      {/* Split Layout: Map on left, Layer Catalogue on right */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 z-30 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center">
              <LoadingSpinner label="Loading GIS layers metadata..." />
            </div>
          )}

          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4">
              <ErrorAlert
                title="Layers Service Unavailable"
                message={error}
                onRetry={reload}
              />
            </div>
          )}

          <MapContainer>
            <RegionLayer boundaryFeature={boundary} />

            {/* Floating Controls */}
            <div className="absolute top-4 right-4 z-[400] flex flex-col space-y-2 pointer-events-auto">
              <LayerControls />
              <MapControls />
            </div>

            {/* Selected Layer Properties Card */}
            {selectedLayer && (
              <div className="absolute top-4 left-4 z-[400] bg-slate-900/95 border border-slate-700/80 rounded-xl p-4 shadow-xl backdrop-blur-md text-xs w-72 pointer-events-auto space-y-2.5">
                <div className="font-semibold text-slate-100 flex items-center space-x-2">
                  <span>📑</span>
                  <span>{selectedLayer.name}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {selectedLayer.description}
                </p>
                <div className="space-y-1 font-mono text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span>Source:</span>
                    <span className="text-slate-200">{selectedLayer.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolution:</span>
                    <span className="text-slate-200">{selectedLayer.resolution || '500m'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Integration:</span>
                    <span className={selectedLayer.is_available ? 'text-emerald-400' : 'text-amber-400'}>
                      {selectedLayer.is_available ? 'Operational' : 'Phase 4 Ingestion Pipeline'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </MapContainer>
        </div>

        {/* Right Catalogue Sidebar */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 p-3.5 flex flex-col shrink-0 z-10 overflow-hidden">
          <div className="pb-3 border-b border-slate-800 mb-3 flex items-center justify-between">
            <span className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
              Available Layers
            </span>
            <span className="text-[10px] font-mono text-slate-400">{layers.length} Datasets</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            <LayerManager
              layers={layers}
              selectedLayerId={selectedLayerId}
              onSelectLayer={setSelectedLayerId}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
