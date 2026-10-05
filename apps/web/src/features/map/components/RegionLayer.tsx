import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useMapContext } from '../hooks/useMapContext';
import { GeoJSONFeature, PolygonGeometry, MultiPolygonGeometry } from '../../../types/geo';
import { RegionSummary } from '../../../types/domain';
import { getBoundsFromGeoJSON } from '../utils/geoUtils';

export interface RegionLayerProps {
  boundaryFeature: GeoJSONFeature<PolygonGeometry | MultiPolygonGeometry, RegionSummary> | null;
  autoFit?: boolean;
}

export const RegionLayer: React.FC<RegionLayerProps> = ({
  boundaryFeature,
  autoFit = true,
}) => {
  const { map, activeLayers } = useMapContext();
  const layerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    if (!map) return;

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    if (!boundaryFeature || !activeLayers.regionBoundary) return;

    const geoJsonLayer = L.geoJSON(boundaryFeature as unknown as GeoJSON.GeoJsonObject, {
      style: {
        color: '#38bdf8', // sky-400
        weight: 2,
        dashArray: '4, 4',
        fillColor: '#38bdf8',
        fillOpacity: 0.05,
      },
      onEachFeature: (_, layer) => {
        const props = boundaryFeature.properties;
        if (props) {
          layer.bindTooltip(
            `<div class="font-sans text-xs">
              <strong>${props.name}</strong><br/>
              <span class="text-slate-400 font-mono">${props.code} — ${props.state}</span>
            </div>`,
            { sticky: true, className: 'leaflet-dark-tooltip' }
          );
        }
      },
    });

    geoJsonLayer.addTo(map);
    layerRef.current = geoJsonLayer;

    if (autoFit && boundaryFeature.geometry) {
      const bounds = getBoundsFromGeoJSON(boundaryFeature.geometry);
      if (bounds) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
      }
    }

    return () => {
      if (layerRef.current && map) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [map, boundaryFeature, activeLayers.regionBoundary, autoFit]);

  return null;
};
