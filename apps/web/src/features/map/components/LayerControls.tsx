import React, { useState } from 'react';
import { useMapContext } from '../hooks/useMapContext';

export interface LayerControlsProps {
  className?: string;
}

export const LayerControls: React.FC<LayerControlsProps> = ({ className = '' }) => {
  const { activeLayers, toggleLayer } = useMapContext();
  const [isOpen, setIsOpen] = useState(false);

  const layerItems = [
    { key: 'regionBoundary', label: 'Region Boundary', supported: true, color: '#38bdf8' },
    { key: 'riskChoropleth', label: '24h Risk (500m)', supported: true, color: '#f59e0b' },
    { key: 'activeFires', label: 'Active Thermal Hotspots', supported: true, color: '#ef4444' },
    { key: 'simulationPerimeter', label: '12h Spread Perimeter', supported: true, color: '#ec4899' },
    { key: 'terrain', label: 'Elevation / Slope (CartoDEM)', supported: false, color: '#a855f7' },
    { key: 'weather', label: 'Wind / FWI Vectors (IMD)', supported: false, color: '#06b6d4' },
  ] as const;

  return (
    <div className={`z-[400] relative select-none ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 px-3 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-xl backdrop-blur-md flex items-center space-x-2 text-xs font-semibold text-slate-200 hover:text-amber-400 transition-colors"
        title="Toggle Map Layers"
        aria-expanded={isOpen}
      >
        <span>📑</span>
        <span>Layers</span>
        <span className="text-[10px] text-slate-400">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 w-64 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl p-3 backdrop-blur-md animate-fadeIn text-xs">
          <div className="font-semibold text-slate-200 pb-2 mb-2 border-b border-slate-800 flex justify-between items-center">
            <span>GIS Overlays</span>
            <span className="text-[10px] font-mono text-slate-400">EPSG:4326</span>
          </div>

          <div className="space-y-2">
            {layerItems.map((item) => {
              const isChecked = activeLayers[item.key as keyof typeof activeLayers];
              return (
                <div key={item.key} className="flex items-center justify-between">
                  <label className="flex items-center space-x-2.5 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={!item.supported}
                      onChange={() => toggleLayer(item.key as keyof typeof activeLayers)}
                      className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span
                      className={`text-[11px] ${
                        item.supported ? 'text-slate-200' : 'text-slate-500 line-through'
                      }`}
                    >
                      {item.label}
                    </span>
                  </label>
                  {!item.supported && (
                    <span className="text-[9px] font-mono uppercase px-1 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-800">
                      Soon
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
