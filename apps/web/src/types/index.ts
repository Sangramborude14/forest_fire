/**
 * Canonical frontend domain types mirroring DATA_CONTRACTS.md
 */

export type RiskClass = 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';

export type SimulationStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface RegionSummary {
  id: string;
  code: string;
  name: string;
  state: string;
  area_sqkm: number;
  centroid: {
    type: 'Point';
    coordinates: [number, number]; // [lon, lat]
  };
}

export interface RegionDetail extends RegionSummary {
  boundary: {
    type: 'Feature';
    geometry: {
      type: 'Polygon';
      coordinates: number[][][];
    };
    properties: Record<string, unknown>;
  };
  grid_resolution_meters: number;
  total_cells: number;
}

export interface ActiveFireHotspot {
  id: string;
  coordinates: [number, number]; // [lon, lat]
  satellite: string;
  detected_at: string;
  brightness_temp_k?: number;
  frp_mw?: number;
  confidence_pct: number;
}

export interface RiskPredictionCell {
  grid_cell_id: string;
  coordinates: number[][][]; // Polygon ring
  risk_probability: number;
  risk_class: RiskClass;
  fwi?: number;
  fuel_type?: string;
  elevation_m?: number;
}

export interface SimulationTimestep {
  step_hour: number;
  burned_area_ha: number;
  spread_velocity_kmh: number;
  spread_direction_deg: number;
  intensity_mw: number;
  perimeter?: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

export interface SimulationSession {
  simulation_id: string;
  status: SimulationStatus;
  progress_pct: number;
  duration_hours: number;
  created_at: string;
  completed_at?: string;
  metrics?: {
    total_area_burned_ha: number;
    peak_spread_velocity_kmh: number;
    dominant_spread_direction_deg: number;
  };
}

export interface SystemHealth {
  status: string;
  timestamp: string;
  version: string;
  environment: string;
  services: {
    database: string;
    redis: string;
    celery_broker: string;
  };
}
