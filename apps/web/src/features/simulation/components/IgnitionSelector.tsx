import React, { useState } from 'react';
import { IgnitionPoint } from '../../../types/domain';
import { Button } from '../../../components/ui/Button';

export interface IgnitionSelectorProps {
  ignitionPoint: IgnitionPoint | null;
  onSetIgnition: (point: IgnitionPoint) => void;
  onClearIgnition: () => void;
  className?: string;
}

export const IgnitionSelector: React.FC<IgnitionSelectorProps> = ({
  ignitionPoint,
  onSetIgnition,
  onClearIgnition,
  className = '',
}) => {
  const [manualLat, setManualLat] = useState<string>('');
  const [manualLon, setManualLon] = useState<string>('');
  const [inputError, setInputError] = useState<string | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setInputError('Latitude must be between -90 and 90');
      return;
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      setInputError('Longitude must be between -180 and 180');
      return;
    }

    setInputError(null);
    onSetIgnition({ latitude: lat, longitude: lon });
    setManualLat('');
    setManualLon('');
  };

  return (
    <div
      className={`bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-1.5 font-semibold text-slate-200">
          <span>🎯</span>
          <span>Ignition Origin Point</span>
        </div>
        {ignitionPoint && (
          <button
            onClick={onClearIgnition}
            className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
          >
            Clear Origin
          </button>
        )}
      </div>

      {ignitionPoint ? (
        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1.5 font-mono text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Selected Latitude:</span>
            <span className="text-amber-400 font-bold">{ignitionPoint.latitude.toFixed(5)}°N</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Selected Longitude:</span>
            <span className="text-amber-400 font-bold">{ignitionPoint.longitude.toFixed(5)}°E</span>
          </div>
          <div className="text-[10px] text-emerald-400 pt-1 border-t border-slate-800/50 flex items-center space-x-1">
            <span>✓</span>
            <span>Origin anchored on map. Ready for Cellular Automata dispatch.</span>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-slate-950/40 border border-dashed border-slate-800 text-slate-400 text-center space-y-1">
          <p className="font-medium text-slate-300">Click anywhere on the map</p>
          <p className="text-[10px] text-slate-500">
            or enter manual coordinates below to place fire ignition point.
          </p>
        </div>
      )}

      {/* Manual Coordinate Form */}
      <form onSubmit={handleManualSubmit} className="pt-1 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-400 font-mono block mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 30.2241"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded px-2 py-1 text-slate-200 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 font-mono block mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 78.7842"
              value={manualLon}
              onChange={(e) => setManualLon(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded px-2 py-1 text-slate-200 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {inputError && (
          <p className="text-[10px] text-rose-400 font-mono">{inputError}</p>
        )}

        <Button
          type="submit"
          variant="outline"
          size="sm"
          className="w-full"
          disabled={!manualLat || !manualLon}
        >
          Set Coordinates
        </Button>
      </form>
    </div>
  );
};
