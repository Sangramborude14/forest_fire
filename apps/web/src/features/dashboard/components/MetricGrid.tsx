import React from 'react';
import { MetricCard } from '../../../components/MetricCard';

export interface MetricGridProps {
  regionCount: number;
  activeFireCount: number;
  meanRisk: number;
  gridCells: number;
  highRiskCount?: number;
  maxRisk?: number;
  className?: string;
}

export const MetricGrid: React.FC<MetricGridProps> = ({
  regionCount,
  activeFireCount,
  meanRisk,
  gridCells,
  highRiskCount = 0,
  maxRisk = 0,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ${className}`}>
      <MetricCard
        title="Active Thermal Hotspots"
        value={`${activeFireCount} Detections`}
        subtitle="VIIRS / MODIS (Past 24h Window)"
        variant={activeFireCount > 0 ? 'warning' : 'default'}
        icon="🔥"
      />
      <MetricCard
        title="High & Extreme Risk Cells"
        value={`${highRiskCount} Cells`}
        subtitle="500m cells classified High or Extreme"
        variant={highRiskCount > 0 ? 'danger' : 'default'}
        icon="⚠️"
      />
      <MetricCard
        title="Peak Fire Susceptibility"
        value={maxRisk > 0 ? `${(maxRisk * 100).toFixed(1)}%` : `${(meanRisk * 100).toFixed(1)}%`}
        subtitle={`Mean Regional Index: ${(meanRisk * 100).toFixed(1)}%`}
        variant={maxRisk > 0.75 ? 'danger' : maxRisk > 0.5 ? 'warning' : 'default'}
        icon="📈"
      />
      <MetricCard
        title="500m Grid Partitions"
        value={`${(gridCells ?? 0).toLocaleString()} Cells`}
        subtitle={`${regionCount > 0 ? `${regionCount} Sectors · ` : ''}EPSG:4326 PostGIS`}
        variant="success"
        icon="🗺️"
      />
    </div>
  );
};

