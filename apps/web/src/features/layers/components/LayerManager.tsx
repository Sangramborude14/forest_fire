import React from 'react';
import { LayerMetadata } from '../../../types/domain';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/feedback/Skeleton';

export interface LayerManagerProps {
  layers: LayerMetadata[];
  selectedLayerId: string;
  onSelectLayer: (id: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const LayerManager: React.FC<LayerManagerProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`space-y-3 p-4 ${className}`}>
        <Skeleton className="h-16 w-full" count={4} />
      </div>
    );
  }

  return (
    <div className={`space-y-2.5 overflow-y-auto ${className}`}>
      {layers.map((layer) => {
        const isSelected = layer.id === selectedLayerId;

        const categoryIcons: Record<string, string> = {
          risk: '🗺️',
          fire: '🔥',
          terrain: '⛰️',
          weather: '💨',
          vegetation: '🌲',
          simulation: '⏳',
        };

        return (
          <div
            key={layer.id}
            onClick={() => onSelectLayer(layer.id)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              isSelected
                ? 'bg-amber-600/15 border-amber-500 shadow-md'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-xs text-slate-200 flex items-center space-x-2">
                <span>{categoryIcons[layer.category] || '📑'}</span>
                <span>{layer.name}</span>
              </span>
              <Badge variant={layer.is_available ? 'success' : 'neutral'} size="sm">
                {layer.is_available ? 'Active Layer' : 'Upcoming Phase 4'}
              </Badge>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
              {layer.description}
            </p>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
              <span>Source: {layer.source}</span>
              <span>{layer.resolution || '500m Grid'}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
