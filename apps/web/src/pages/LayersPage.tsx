import React, { useState } from 'react';
import { MapContainer } from '../features/map/MapContainer';

export const LayersPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'fuel' | 'slope' | 'elevation' | 'weather'>('fuel');

  const categories = [
    { id: 'fuel', label: 'Vegetation & Fuel Types', icon: '🌲', source: 'ISRO Bhuvan Land Cover' },
    { id: 'slope', label: 'Topographical Slope', icon: '📐', source: 'CartoDEM 30m' },
    { id: 'elevation', label: 'Digital Elevation Model', icon: '⛰️', source: 'SRTM DEM' },
    { id: 'weather', label: 'Meteorological Vectors', icon: '💨', source: 'IMD API / ERA5' },
  ] as const;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <div className="h-12 bg-slate-900 border-b border-slate-800 px-5 flex items-center justify-between shrink-0 text-xs z-10">
        <div className="flex items-center space-x-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="text-slate-400 font-mono text-[11px]">
          Source: {categories.find((c) => c.id === selectedCategory)?.source}
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <MapContainer activeLayer="none">
          <div className="absolute top-4 left-4 z-20 bg-slate-900/95 border border-slate-700/80 rounded-xl p-4 shadow-xl backdrop-blur-md text-xs w-72">
            <h4 className="font-semibold text-slate-200 mb-2">Layer Properties</h4>
            <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Resolution:</span>
                <span>500m × 500m Resampled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Projection:</span>
                <span>EPSG:4326</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400">Normalized Raster</span>
              </div>
            </div>
          </div>
        </MapContainer>
      </div>
    </div>
  );
};
