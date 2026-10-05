import React from 'react';
import { MapContainer } from '../features/map/components/MapContainer';
import { RegionLayer } from '../features/map/components/RegionLayer';
import { FireLayer } from '../features/map/components/FireLayer';
import { MapControls } from '../features/map/components/MapControls';
import { LayerControls } from '../features/map/components/LayerControls';
import { FireList } from '../features/fire/components/FireList';
import { FireDetailsCard } from '../features/fire/components/FireDetailsCard';
import { useActiveFires } from '../features/fire/hooks/useActiveFires';
import { RegionSummary, FireHotspotProperties } from '../types/domain';
import { GeoJSONFeature, PolygonGeometry, MultiPolygonGeometry } from '../types/geo';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import { ErrorAlert } from '../components/feedback/ErrorAlert';

export interface ActiveFiresPageProps {
  selectedRegion: RegionSummary | null;
  boundary: GeoJSONFeature<PolygonGeometry | MultiPolygonGeometry, RegionSummary> | null;
}

export const ActiveFiresPage: React.FC<ActiveFiresPageProps> = ({
  selectedRegion,
  boundary,
}) => {
  const {
    filteredFeatures,
    selectedFire,
    setSelectedFire,
    confidenceFilter,
    setConfidenceFilter,
    isLoading,
    error,
    reload,
  } = useActiveFires(selectedRegion?.id);

  const hotspotPropertiesList = filteredFeatures.map((f: { properties: FireHotspotProperties }) => f.properties);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Top Filter and Telemetry Ribbon */}
      <div className="h-12 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 text-xs z-10">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-300">Satellite Sensor Feeds:</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
            VIIRS NOAA-20 / MODIS Aqua-Terra
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Confidence:</span>
          {['all', 'high', 'nominal'].map((conf) => (
            <button
              key={conf}
              onClick={() => setConfidenceFilter(conf)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold capitalize transition-colors ${
                confidenceFilter === conf
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {conf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: Map on left/center, Fire List on right */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Map Viewport */}
        <div className="flex-1 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 z-30 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center">
              <LoadingSpinner label="Fetching satellite thermal anomalies..." />
            </div>
          )}

          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4">
              <ErrorAlert
                title="Active Fires API Unavailable"
                message={error}
                onRetry={reload}
              />
            </div>
          )}

          <MapContainer>
            <RegionLayer boundaryFeature={boundary} />
            <FireLayer
              firesData={
                filteredFeatures.length > 0
                  ? { type: 'FeatureCollection', features: filteredFeatures }
                  : null
              }
              selectedFireId={selectedFire?.id}
              onSelectFire={(fire: FireHotspotProperties) => setSelectedFire(fire)}
            />

            {/* Floating Controls */}
            <div className="absolute top-4 right-4 z-[400] flex flex-col space-y-2 pointer-events-auto">
              <LayerControls />
              <MapControls />
            </div>

            {/* Selected Fire Telemetry Modal / Overlay */}
            {selectedFire && (
              <div className="absolute top-4 left-4 z-[400] max-w-xs pointer-events-auto">
                <FireDetailsCard
                  fire={selectedFire}
                  onClose={() => setSelectedFire(null)}
                />
              </div>
            )}
          </MapContainer>
        </div>

        {/* Right Thermal Hotspots Sidebar */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 z-10 overflow-hidden">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <span className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
              Hotspots ({filteredFeatures.length})
            </span>
            <span className="text-[10px] font-mono text-slate-400">Past 24h Window</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            <FireList
              fires={hotspotPropertiesList}
              selectedFireId={selectedFire?.id}
              onSelectFire={(fire: FireHotspotProperties) => setSelectedFire(fire)}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
