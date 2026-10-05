import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useMapContext } from '../hooks/useMapContext';
import { IgnitionPoint, SimulationStepProperties } from '../../../types/domain';
import { GeoJSONFeatureCollection, MultiPolygonGeometry } from '../../../types/geo';
import { createIgnitionIcon } from '../utils/geoUtils';

export interface SimulationLayerProps {
  ignitionPoint?: IgnitionPoint | null;
  perimeterData?: GeoJSONFeatureCollection<MultiPolygonGeometry, SimulationStepProperties> | null;
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
            layer.bindTooltip(
              `<div class="font-sans text-xs">
                <strong>Step ${props.step_number} (+${props.elapsed_minutes}m)</strong><br/>
                Burned Area: ${props.cumulative_burned_area_ha.toFixed(1)} ha<br/>
                Active Front: ${props.active_front_cells_count} cells
              </div>`,
              { sticky: true, className: 'leaflet-dark-tooltip' }
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
