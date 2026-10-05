import { useState, useEffect, useCallback } from 'react';
import { fetchRegions, fetchRegionBoundary } from '../../../services/api/regions';
import { RegionSummary } from '../../../types/domain';
import { GeoJSONFeature, PolygonGeometry, MultiPolygonGeometry } from '../../../types/geo';

export function useRegions() {
  const [regions, setRegions] = useState<RegionSummary[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('');
  const [boundary, setBoundary] = useState<
    GeoJSONFeature<PolygonGeometry | MultiPolygonGeometry, RegionSummary> | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingBoundary, setIsLoadingBoundary] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load available regions
  const loadRegions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchRegions();
      setRegions(data);
      if (data.length > 0 && !selectedRegionId) {
        setSelectedRegionId(data[0].id);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load regions');
    } finally {
      setIsLoading(false);
    }
  }, [selectedRegionId]);

  useEffect(() => {
    loadRegions();
  }, [loadRegions]);

  // Load region boundary when selectedRegionId changes
  useEffect(() => {
    if (!selectedRegionId) {
      setBoundary(null);
      return;
    }

    let isMounted = true;
    setIsLoadingBoundary(true);

    fetchRegionBoundary(selectedRegionId)
      .then((feat: GeoJSONFeature<PolygonGeometry | MultiPolygonGeometry, RegionSummary>) => {
        if (isMounted) setBoundary(feat);
      })
      .catch((err: unknown) => {
        console.warn('Failed to fetch region boundary:', err);
        if (isMounted) setBoundary(null);
      })
      .finally(() => {
        if (isMounted) setIsLoadingBoundary(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedRegionId]);

  const selectedRegion = regions.find((r) => r.id === selectedRegionId) || null;

  return {
    regions,
    selectedRegionId,
    setSelectedRegionId,
    selectedRegion,
    boundary,
    isLoading,
    isLoadingBoundary,
    error,
    reload: loadRegions,
  };
}
