/**
 * Geospatial conversion and styling utilities for Leaflet GIS rendering
 */

import L from 'leaflet';
import { APP_CONFIG, RiskLevelKey } from '../../../app/config';
import { RiskClass } from '../../../types/domain';

/**
 * Returns color and opacity settings for a risk classification
 */
export function getRiskStyle(riskClass: RiskClass | string) {
  const normalizedKey = (riskClass.toUpperCase() as RiskLevelKey) || 'LOW';
  const config = APP_CONFIG.riskColors[normalizedKey] || APP_CONFIG.riskColors.LOW;
  return {
    fillColor: config.fillColor,
    color: config.strokeColor,
    weight: 1,
    opacity: 0.8,
    fillOpacity: config.fillOpacity,
  };
}

/**
 * Creates an animated SVG hotspot marker for active satellite fires
 */
export function createHotspotIcon(confidence: string = 'nominal', frp: number | null = null): L.DivIcon {
  const isHigh = confidence === 'high' || (frp !== null && frp > 50);
  const color = isHigh ? '#ef4444' : '#f97316';
  const pulseClass = isHigh ? 'hotspot-marker-pulse' : '';

  const html = `
    <div class="relative flex items-center justify-center w-7 h-7">
      <div class="absolute w-6 h-6 rounded-full opacity-75 ${pulseClass}" style="background-color: ${color}40;"></div>
      <div class="w-4 h-4 rounded-full flex items-center justify-center shadow-lg border-2 border-white" style="background-color: ${color};">
        <span style="font-size: 8px;">🔥</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-hotspot-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

/**
 * Creates an ignition point marker for simulation setup
 */
export function createIgnitionIcon(): L.DivIcon {
  const html = `
    <div class="relative flex items-center justify-center w-8 h-8">
      <div class="w-6 h-6 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-2xl animate-bounce">
        🎯
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-ignition-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

/**
 * Extracts a Leaflet LatLngBounds from GeoJSON geometry coordinates
 */
export function getBoundsFromGeoJSON(geometry: {
  type: string;
  coordinates: unknown;
}): L.LatLngBounds | null {
  try {
    const latLngs: L.LatLng[] = [];

    const extractCoords = (coords: unknown) => {
      if (Array.isArray(coords)) {
        if (
          coords.length >= 2 &&
          typeof coords[0] === 'number' &&
          typeof coords[1] === 'number'
        ) {
          // GeoJSON is [longitude, latitude]
          latLngs.push(L.latLng(coords[1], coords[0]));
        } else {
          coords.forEach(extractCoords);
        }
      }
    };

    extractCoords(geometry.coordinates);

    if (latLngs.length === 0) return null;
    return L.latLngBounds(latLngs);
  } catch {
    return null;
  }
}

/**
 * Checks whether a 2D point (x=lon, y=lat) is inside a linear ring
 */
function isPointInRing(x: number, y: number, ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Verifies whether geographic coordinate {latitude, longitude} is contained
 * within a GeoJSON Polygon or MultiPolygon geometry.
 */
export function isPointInGeometry(
  point: { latitude: number; longitude: number },
  geometry?: { type: string; coordinates: unknown } | null
): boolean {
  if (!geometry || !geometry.coordinates) {
    return true; // No boundary restriction provided
  }

  const { longitude: x, latitude: y } = point;

  if (geometry.type === 'Polygon') {
    const rings = geometry.coordinates as number[][][];
    if (!rings || rings.length === 0) return true;
    // Must be inside exterior ring (ring 0) and outside holes (ring 1..n)
    const inExterior = isPointInRing(x, y, rings[0]);
    if (!inExterior) return false;
    for (let h = 1; h < rings.length; h++) {
      if (isPointInRing(x, y, rings[h])) return false;
    }
    return true;
  }

  if (geometry.type === 'MultiPolygon') {
    const polygons = geometry.coordinates as number[][][][];
    if (!polygons || polygons.length === 0) return true;
    for (const rings of polygons) {
      if (rings && rings.length > 0 && isPointInRing(x, y, rings[0])) {
        let inHole = false;
        for (let h = 1; h < rings.length; h++) {
          if (isPointInRing(x, y, rings[h])) {
            inHole = true;
            break;
          }
        }
        if (!inHole) return true;
      }
    }
    return false;
  }

  return true;
}
