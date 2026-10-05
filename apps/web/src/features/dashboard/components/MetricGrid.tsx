import React from 'react';
import { MetricCard } from '../../../components/MetricCard';

export interface MetricGridProps {
  regionCount: number;
  activeFireCount: number;
  meanRisk: number;
  gridCells: number;
  className?: string;
}

export const MetricGrid: React.FC<MetricGridProps> = ({
  regionCount,
  activeFireCount,
  meanRisk,
  gridCells,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 ${className}`}>
      <MetricCard
        title="Monitored Reserves"
        value={`${regionCount} Regions`}
        subtitle="Uttarakhand, Similipal, Bandipur"
        icon="🌲"
      />
      <MetricCard
        title="Active Hotspots"
        value={`${activeFireCount} Detections`}
        subtitle="VIIRS / MODIS (Past 24h)"
        variant={activeFireCount > 0 ? 'warning' : 'default'}
        icon="🔥"
      />
      <MetricCard
        title="Mean Susceptibility"
        value={meanRisk > 0 ? meanRisk.toFixed(2) : '0.28'}
        subtitle="Regional Susceptibility Baseline"
        variant={meanRisk > 0.5 ? 'danger' : 'default'}
        icon="📈"
      />
      <MetricCard
        title="500m Grid Partitions"
        value={`${(gridCells ?? 0).toLocaleString()} Cells`}
        subtitle="EPSG:4326 Normalized Spatial Grid"
        variant="success"
        icon="🗺️"
      />
    </div>
  );
};
