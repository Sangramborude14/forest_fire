import React from 'react';
import { FireHotspotProperties } from '../../../types/domain';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { Skeleton } from '../../../components/feedback/Skeleton';

export interface FireListProps {
  fires: FireHotspotProperties[];
  selectedFireId?: string | null;
  onSelectFire: (fire: FireHotspotProperties) => void;
  isLoading?: boolean;
}

export const FireList: React.FC<FireListProps> = ({
  fires,
  selectedFireId,
  onSelectFire,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2 p-3">
        <Skeleton className="h-14 w-full" count={4} />
      </div>
    );
  }

  if (fires.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          title="No Active Fires"
          description="No thermal hotspot anomalies detected in the selected spatial filter."
          icon="🛡️"
        />
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-800/80 overflow-y-auto">
      {fires.map((fire) => {
        const isSelected = fire.id === selectedFireId;
        const confidenceBadgeVariant =
          fire.confidence === 'high'
            ? 'danger'
            : fire.confidence === 'nominal'
            ? 'warning'
            : 'neutral';

        return (
          <div
            key={fire.id}
            onClick={() => onSelectFire(fire)}
            className={`p-3.5 cursor-pointer transition-colors ${
              isSelected
                ? 'bg-amber-600/15 border-l-2 border-amber-500'
                : 'hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-xs text-slate-200 flex items-center space-x-1.5">
                <span className="text-sm">🔥</span>
                <span>{fire.satellite || 'Satellite Sensor'}</span>
              </span>
              <Badge variant={confidenceBadgeVariant} size="sm">
                {fire.confidence || 'Nominal'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 mt-2">
              <div>
                <span className="text-slate-500 mr-1">FRP:</span>
                <span className="text-amber-400 font-semibold">
                  {fire.frp_mw !== null ? `${fire.frp_mw.toFixed(1)} MW` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 mr-1">Temp:</span>
                <span className="text-slate-200">
                  {fire.brightness_temperature_kelvin !== null
                    ? `${fire.brightness_temperature_kelvin.toFixed(1)} K`
                    : 'N/A'}
                </span>
              </div>
              <div className="col-span-2 text-[10px] text-slate-500 truncate">
                Detected: {new Date(fire.detection_time).toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
