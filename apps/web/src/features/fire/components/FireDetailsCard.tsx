import React from 'react';
import { FireHotspotProperties } from '../../../types/domain';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export interface FireDetailsCardProps {
  fire: FireHotspotProperties | null;
  onClose: () => void;
  onSimulateFromFire?: (fire: FireHotspotProperties) => void;
  className?: string;
}

export const FireDetailsCard: React.FC<FireDetailsCardProps> = ({
  fire,
  onClose,
  onSimulateFromFire,
  className = '',
}) => {
  if (!fire) return null;

  return (
    <div
      className={`bg-slate-900/95 border border-slate-700/80 rounded-xl p-4 shadow-2xl backdrop-blur-md text-xs ${className}`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-base">🔥</span>
          <div>
            <h4 className="font-semibold text-slate-100">Thermal Hotspot Telemetry</h4>
            <span className="text-[10px] font-mono text-slate-400">ID: {fire.id}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 text-sm p-1 rounded hover:bg-slate-800"
          aria-label="Close details"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2.5 font-mono text-[11px] text-slate-300">
        <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Sensor / Satellite:</span>
          <Badge variant="info" size="sm">{fire.satellite || 'MODIS/VIIRS'}</Badge>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Confidence Rating:</span>
          <Badge
            variant={fire.confidence === 'high' ? 'danger' : 'warning'}
            size="sm"
          >
            {fire.confidence?.toUpperCase() || 'NOMINAL'}
          </Badge>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Coordinates:</span>
          <span className="text-slate-200">
            {fire.latitude !== undefined && fire.longitude !== undefined
              ? `${fire.latitude.toFixed(4)}°N, ${fire.longitude.toFixed(4)}°E`
              : 'Point geometry'}
          </span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Fire Radiative Power:</span>
          <span className="font-bold text-amber-400">
            {fire.frp_mw !== null ? `${fire.frp_mw.toFixed(1)} MW` : 'Not available'}
          </span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Brightness Temperature:</span>
          <span className="text-slate-100">
            {fire.brightness_temperature_kelvin !== null
              ? `${fire.brightness_temperature_kelvin.toFixed(1)} K`
              : 'Not available'}
          </span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Detection Timestamp:</span>
          <span className="text-slate-200">
            {new Date(fire.detection_time).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400">Operational Status:</span>
          <span className="text-rose-400 uppercase font-semibold">
            {fire.status || 'Active Hotspot'}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center space-x-2">
        {onSimulateFromFire && (
          <Button
            variant="primary"
            size="sm"
            className="flex-1 font-semibold text-[11px]"
            onClick={() => onSimulateFromFire(fire)}
          >
            ⏳ Simulate Spread
          </Button>
        )}
        <Button variant="secondary" size="sm" onClick={onClose}>
          Dismiss
        </Button>
      </div>
    </div>
  );
};
