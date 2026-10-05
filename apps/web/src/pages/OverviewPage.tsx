import React from 'react';
import { MetricCard } from '../components/MetricCard';
import { MapContainer } from '../features/map/MapContainer';

export const OverviewPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top Metric Summary Bar */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-slate-900/60 border-b border-slate-800 shrink-0">
        <MetricCard
          title="Monitored Divisions"
          value="2 Divisions"
          subtitle="Garhwal & Wayanad"
          icon="🌲"
        />
        <MetricCard
          title="Active Hotspots"
          value="1 Detections"
          subtitle="VIIRS / MODIS (Past 24h)"
          variant="warning"
          icon="🛰️"
        />
        <MetricCard
          title="Mean Risk Index"
          value="0.34"
          subtitle="Moderate Susceptibility"
          variant="default"
          icon="📈"
        />
        <MetricCard
          title="Grid Coverage"
          value="11,362 Cells"
          subtitle="500m × 500m partitions"
          variant="success"
          icon="🗺️"
        />
      </div>

      {/* Main Interactive GIS Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <MapContainer activeLayer="risk" />
      </div>
    </div>
  );
};
