/**
 * Domain entity types conforming to DATA_CONTRACTS.md and Phase 2 backend
 */

import { BoundingBox } from './geo';

export type RiskClass = 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';

export type SimulationStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export type FireConfidence = 'low' | 'nominal' | 'high';

export type FireStatus = 'active' | 'contained' | 'extinguished';

// --- Region ---
export interface RegionSummary {
  id: string;
  code: string;
  name: string;
  state: string;
  area_sqkm: number;
  bbox?: BoundingBox;
  is_active?: boolean;
}

export interface RegionDetail extends RegionSummary {
  description?: string;
  grid_resolution_meters: number;
  total_cells?: number;
  created_at?: string;
  updated_at?: string;
}

// --- Active Fire Hotspots ---
export interface FireHotspotProperties {
  id: string;
  detection_time: string;
  satellite: string;
  confidence: FireConfidence | string;
  frp_mw: number | null;
  brightness_temperature_kelvin: number | null;
  status: FireStatus | string;
  region_id?: string | null;
  raw_properties?: Record<string, unknown>;
}

export interface FireEventDetail extends FireHotspotProperties {
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lon, lat]
  };
  footprint?: {
    type: 'MultiPolygon';
    coordinates: number[][][][];
  } | null;
  created_at?: string;
}

// --- 24h Risk Prediction ---
export interface RiskPredictionProperties {
  cell_id: string;
  risk_probability: number;
  risk_class: RiskClass;
  fwi_index?: number | null;
  elevation?: number | null;
  slope?: number | null;
  aspect?: number | null;
  fuel_type?: string | null;
  model_version?: string;
  target_date?: string;
}

export interface RiskSummary {
  region_id: string;
  target_date: string;
  total_cells: number;
  high_risk_cells: number;
  extreme_risk_cells: number;
  mean_probability: number;
  risk_distribution: {
    low: number;
    moderate: number;
    high: number;
    extreme: number;
  };
}

// --- 12h Spread Simulation ---
export interface IgnitionPoint {
  latitude: number;
  longitude: number;
}

export interface SimulationCreateRequest {
  region_id: string;
  name: string;
  ignition_points: IgnitionPoint[];
  max_duration_hours?: number;
  temporal_step_minutes?: number;
}

export interface SimulationJob {
  simulation_id: string;
  status: SimulationStatus;
  message?: string;
  submitted_at: string;
}

export interface SimulationDetail {
  id: string;
  region_id: string;
  name: string;
  status: SimulationStatus;
  ignition_source: string;
  max_duration_hours: number;
  temporal_step_minutes: number;
  perimeter_summary_geojson?: Record<string, unknown> | null;
  created_at: string;
  started_at?: string | null;
  completed_at?: string | null;
  error_message?: string | null;
}

export interface SimulationStepProperties {
  step_number: number;
  elapsed_minutes: number;
  cumulative_burned_area_ha: number;
  active_front_cells_count: number;
  max_rate_of_spread_meters_per_min?: number;
}

// --- GIS Layers Metadata ---
export interface LayerLegendItem {
  label: string;
  color: string;
  value?: string;
}

export interface LayerMetadata {
  id: string;
  name: string;
  category: 'risk' | 'fire' | 'terrain' | 'weather' | 'vegetation' | 'simulation';
  description: string;
  resolution?: string;
  source: string;
  is_available: boolean;
  legend?: LayerLegendItem[];
}
