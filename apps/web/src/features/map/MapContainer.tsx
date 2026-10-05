import React, { useState } from 'react';

interface MapContainerProps {
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  activeLayer?: 'risk' | 'simulation' | 'fires' | 'none';
  simulationHour?: number;
  children?: React.ReactNode;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  centerLat = 30.2241,
  centerLng = 78.7842,
  zoom = 10,
  activeLayer = 'risk',
  simulationHour = 1,
  children,
}) => {
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [layersOpen, setLayersOpen] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col select-none">
      {/* GIS Map Canvas Viewport */}
      <div className="relative flex-1 w-full h-full bg-[#0b132b] flex items-center justify-center overflow-hidden">
        {/* Geometric GIS Grid Pattern representing 500m coordinate alignment */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #38bdf8 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
            backgroundSize: `20px 20px, 40px 40px, 40px 40px`,
          }}
        />

        {/* Central Geographic Reference Area Representation */}
        <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center max-w-lg">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-center space-x-2 text-xs font-semibold text-amber-400 mb-2">
              <span>📍</span>
              <span>GARHWAL DIVISION — EPSG:4326</span>
            </div>
            <div className="text-sm font-medium text-slate-200">
              Active Map Viewport: [{centerLat.toFixed(4)}°N, {centerLng.toFixed(4)}°E]
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Common 500m × 500m spatial partition viewport. Layer rendering and interactive tiles configured for Phase 2 integration.
            </p>

            {/* Deterministic visual layout indicators */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-center space-x-4 text-xs font-mono">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500/80" />
                <span className="text-slate-300">Low</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500/80" />
                <span className="text-slate-300">Moderate</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-orange-500/80" />
                <span className="text-slate-300">High</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-rose-500/80" />
                <span className="text-slate-300">Extreme</span>
              </span>
            </div>
          </div>
        </div>

        {/* Embedded Children Overlays (e.g., Timeline Controls, Panels) */}
        {children}
      </div>

      {/* Map Control Tools: Zoom & Layers Floating Widget */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
        <div className="bg-slate-900/90 border border-slate-700 rounded-lg shadow-lg flex flex-col overflow-hidden backdrop-blur-sm">
          <button
            onClick={() => setCurrentZoom((z) => Math.min(z + 1, 18))}
            className="w-8 h-8 flex items-center justify-center text-slate-200 hover:bg-slate-800 transition-colors font-bold text-sm border-b border-slate-800"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => setCurrentZoom((z) => Math.max(z - 1, 3))}
            className="w-8 h-8 flex items-center justify-center text-slate-200 hover:bg-slate-800 transition-colors font-bold text-sm"
            title="Zoom Out"
          >
            −
          </button>
        </div>

        {/* Layer Toggle Panel */}
        <div className="bg-slate-900/95 border border-slate-700 rounded-lg shadow-lg p-3 text-xs w-48 backdrop-blur-md">
          <div
            className="flex items-center justify-between font-semibold text-slate-300 cursor-pointer"
            onClick={() => setLayersOpen(!layersOpen)}
          >
            <span>GIS Overlays</span>
            <span className="text-[10px] text-slate-400">{layersOpen ? '▲' : '▼'}</span>
          </div>

          {layersOpen && (
            <div className="mt-2 pt-2 border-t border-slate-800 space-y-2">
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
                />
                <span>500m Grid Cells</span>
              </label>
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showHotspots}
                  onChange={(e) => setShowHotspots(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
                />
                <span>Active Thermal Hotspots</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Bottom GIS Status Footer Bar */}
      <div className="h-6 bg-slate-950 border-t border-slate-800/80 px-4 flex items-center justify-between text-[11px] text-slate-400 font-mono shrink-0 z-20">
        <div className="flex space-x-4">
          <span>Lat: {centerLat.toFixed(5)}°</span>
          <span>Lon: {centerLng.toFixed(5)}°</span>
          <span>Zoom: {currentZoom}</span>
        </div>
        <div className="flex space-x-4">
          <span>Grid Cell: 500m × 500m</span>
          <span>CRS: EPSG:4326</span>
          <span className="text-amber-400 font-semibold uppercase">
            Active: {activeLayer}{activeLayer === 'simulation' ? ` (Hour ${simulationHour})` : ''}
          </span>
        </div>
      </div>
    </div>
  );
};
