/**
 * Risk Prediction API service
 */

import { httpClient } from './client';
import { RiskPredictionProperties, RiskSummary } from '../../types/domain';
import { GeoJSONFeatureCollection, PolygonGeometry } from '../../types/geo';

export async function fetchRiskPredictions(
  regionId: string,
  targetDate?: string
): Promise<GeoJSONFeatureCollection<PolygonGeometry, RiskPredictionProperties>> {
  const query = new URLSearchParams();
  if (targetDate) query.set('target_date', targetDate);

  const queryString = query.toString();
  const path = `/risk/${encodeURIComponent(regionId)}${queryString ? `?${queryString}` : ''}`;
  return httpClient.get<GeoJSONFeatureCollection<PolygonGeometry, RiskPredictionProperties>>(path);
}

export async function fetchRiskSummary(
  regionId: string,
  targetDate?: string
): Promise<RiskSummary> {
  const query = new URLSearchParams();
  if (targetDate) query.set('target_date', targetDate);

  const queryString = query.toString();
  const path = `/risk/${encodeURIComponent(regionId)}/summary${queryString ? `?${queryString}` : ''}`;
  return httpClient.get<RiskSummary>(path);
}
