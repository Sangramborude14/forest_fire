import React from 'react';
import { useMapContext } from '../hooks/useMapContext';
import { BaseMapType } from '../types/map';

export interface MapControlsProps {
  onResetView?: () => void;
  className?: string;
}

export const MapControls: React.FC<MapControlsProps> = ({ onResetView, className = '' }) => {
  const { map, baseMap, setBaseMap } = useMapContext();

  const handleZoomIn = () => {
    if (map) map.zoomIn();
  };

  const handleZoomOut = () => {
    if (map) map.zoomOut();
  };

  return (
    <div className={`flex flex-col space-y-2 z-[400] select-none ${className}`}>
      {/* Zoom In / Out Controls */}
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-xl backdrop-blur-md flex flex-col overflow-hidden">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 flex items-center justify-center text-slate-200 hover:bg-slate-800 hover:text-amber-400 transition-colors font-bold text-sm border-b border-slate-800"
          title="Zoom In"
          aria-label="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 flex items-center justify-center text-slate-200 hover:bg-slate-800 hover:text-amber-400 transition-colors font-bold text-sm"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          −
        </button>
      </div>

      {/* Reset / Fit Region View */}
      {onResetView && (
        <button
          onClick={onResetView}
          className="w-8 h-8 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-xl backdrop-blur-md flex items-center justify-center text-slate-200 hover:bg-slate-800 hover:text-amber-400 transition-colors text-xs font-semibold"
          title="Reset to Region Bounds"
          aria-label="Reset View"
        >
          🎯
        </button>
      )}

      {/* Basemap switcher */}
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-xl backdrop-blur-md p-1 flex flex-col space-y-1">
        {(
          [
            { id: 'darkMatter', label: 'Dark', icon: '🌑' },
            { id: 'satellite', label: 'Sat', icon: '🛰️' },
            { id: 'osm', label: 'Street', icon: '🗺️' },
          ] as const
        ).map((b) => (
          <button
            key={b.id}
            onClick={() => setBaseMap(b.id as BaseMapType)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] transition-colors ${
              baseMap === b.id
                ? 'bg-amber-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={`Switch to ${b.label} basemap`}
            aria-label={`Switch to ${b.label} basemap`}
          >
            {b.icon}
          </button>
        ))}
      </div>
    </div>
  );
};
