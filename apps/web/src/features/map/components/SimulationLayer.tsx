import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useMapContext } from '../hooks/useMapContext';
import { IgnitionPoint, SimulationStepProperties } from '../../../types/domain';
import { GeoJSONFeatureCollection, MultiPolygonGeometry, PolygonGeometry } from '../../../types/geo';
import { createIgnitionIcon } from '../utils/geoUtils';

export interface SimulationLayerProps {
  ignitionPoint?: IgnitionPoint | null;
  perimeterData?: GeoJSONFeatureCollection<
    MultiPolygonGeometry | PolygonGeometry,
    SimulationStepProperties
  > | null;
  currentStepIndex?: number;
}

export const SimulationLayer: React.FC<SimulationLayerProps> = ({
  ignitionPoint,
  perimeterData,
  currentStepIndex = 0,
}) => {
  const { map, activeLayers } = useMapContext();
  const ignitionMarkerRef = useRef<L.Marker | null>(null);
  const perimeterLayerRef = useRef<L.GeoJSON | null>(null);

  // 1. Ignition Point Marker
  useEffect(() => {
    if (!map) return;

    if (ignitionMarkerRef.current) {
      map.removeLayer(ignitionMarkerRef.current);
      ignitionMarkerRef.current = null;
    }

    if (ignitionPoint) {
      const icon = createIgnitionIcon();
      const marker = L.marker([ignitionPoint.latitude, ignitionPoint.longitude], {
        icon,
        title: `Ignition Point: ${ignitionPoint.latitude.toFixed(4)}°N, ${ignitionPoint.longitude.toFixed(4)}°E`,
      });

      marker.bindPopup(
        `<div class="p-1 font-sans text-xs">
          <strong class="text-rose-400">🎯 Simulation Ignition Point</strong><br/>
          <span class="font-mono text-slate-300">
            ${ignitionPoint.latitude.toFixed(4)}°N, ${ignitionPoint.longitude.toFixed(4)}°E
          </span>
        </div>`
      );

      marker.addTo(map);
      ignitionMarkerRef.current = marker;
    }

    return () => {
      if (ignitionMarkerRef.current && map) {
        map.removeLayer(ignitionMarkerRef.current);
      }
    };
  }, [map, ignitionPoint]);

  // 2. Simulation Step Perimeters
  useEffect(() => {
    if (!map) return;

    if (perimeterLayerRef.current) {
      map.removeLayer(perimeterLayerRef.current);
      perimeterLayerRef.current = null;
    }

    if (!perimeterData || !activeLayers.simulationPerimeter || !perimeterData.features?.length) {
      return;
    }

    // Filter features up to currentStepIndex
    const visibleFeatures = perimeterData.features.filter(
      (_, index) => index <= currentStepIndex
    );

    const geoJsonLayer = L.geoJSON(
      { type: 'FeatureCollection', features: visibleFeatures } as unknown as GeoJSON.GeoJsonObject,
      {
        style: (feature) => {
          const props = feature?.properties as SimulationStepProperties | undefined;
          const isLatest =
            props?.step_number === visibleFeatures[visibleFeatures.length - 1]?.properties?.step_number;

          return {
            color: isLatest ? '#f43f5e' : '#fb923c', // rose-500 or orange-400
            weight: isLatest ? 2.5 : 1.5,
            fillColor: isLatest ? '#f43f5e' : '#ea580c',
            fillOpacity: isLatest ? 0.35 : 0.15,
            dashArray: isLatest ? undefined : '3, 3',
          };
        },
        onEachFeature: (feature, layer) => {
          const props = feature.properties as SimulationStepProperties;
          if (props) {
            const stepNum = props.step_hour ?? props.step_number;
            layer.bindTooltip(
              `<div class="font-sans text-xs">
                <strong>Hour ${stepNum} (T+${props.elapsed_minutes}m)</strong><br/>
                Burned Area: <strong>${props.cumulative_burned_area_ha.toFixed(1)} ha</strong><br/>
                ${props.spread_velocity_kmh !== undefined ? `Velocity: ${props.spread_velocity_kmh.toFixed(1)} km/h<br/>` : ''}
                Active Front: ${props.active_front_cells_count || 0} cells
              </div>`,
              { sticky: true, className: 'leaflet-dark-tooltip' }
            );

            layer.bindPopup(
              `<div class="p-1 font-sans text-xs space-y-1">
                <div class="font-bold text-amber-400 border-b border-slate-700 pb-1">
                  Simulation Step ${stepNum} (T+${props.elapsed_minutes} min)
                </div>
                <div class="font-mono text-slate-200">
                  Cumulative Burned: <span class="text-rose-400 font-bold">${props.cumulative_burned_area_ha.toFixed(1)} ha</span>
                </div>
                ${props.spread_velocity_kmh !== undefined ? `
                <div class="font-mono text-slate-300">
                  Spread Velocity: ${props.spread_velocity_kmh.toFixed(2)} km/h
                </div>` : ''}
                ${props.spread_direction_deg !== undefined ? `
                <div class="font-mono text-slate-300">
                  Spread Direction: ${props.spread_direction_deg.toFixed(0)}°
                </div>` : ''}
                <div class="font-mono text-slate-300">
                  Active Front: ${props.active_front_cells_count || 0} cells
                </div>
              </div>`
            );
          }
        },
      }
    );

    geoJsonLayer.addTo(map);
    perimeterLayerRef.current = geoJsonLayer;

    return () => {
      if (perimeterLayerRef.current && map) {
        map.removeLayer(perimeterLayerRef.current);
      }
    };
  }, [map, perimeterData, currentStepIndex, activeLayers.simulationPerimeter]);

  return null;
};
