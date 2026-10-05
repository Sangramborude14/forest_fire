"""Active Fire Hotspots API router."""

from typing import Optional
from fastapi import APIRouter, Query, status
from ...schemas.common import GeoJSONFeatureCollection, GeoJSONFeature, GeoJSONPoint
from ...schemas.fires import ActiveFireProperties

router = APIRouter(prefix="/fires", tags=["Active Fires"])


@router.get(
    "/active",
    response_model=GeoJSONFeatureCollection,
    status_code=status.HTTP_200_OK,
    summary="Get Active Satellite Fire Detections"
)
async def get_active_fires(
    region_id: Optional[str] = Query(None, description="Filter active detections by region"),
    hours: int = Query(24, ge=1, le=72, description="Observation time window in hours"),
    min_confidence: float = Query(50.0, ge=0.0, le=100.0, description="Minimum detection confidence percentage"),
) -> GeoJSONFeatureCollection:
    """
    Retrieve active thermal anomalies and hotspot locations detected via
    MODIS, VIIRS, or INSAT-3D sensors within the specified time window.
    """
    # Contract placeholder conforming to GeoJSON FeatureCollection
    features = [
        GeoJSONFeature(
            type="Feature",
            id="f8a9e712-4523-41a3-b3c1-019283746554",
            geometry={"type": "Point", "coordinates": [78.7523, 30.2104]},
            properties={
                "satellite": "VIIRS_NOAA20",
                "detected_at": "2026-10-05T14:30:00Z",
                "brightness_temp_k": 348.6,
                "frp_mw": 42.1,
                "confidence_pct": 88.0,
                "day_night": "D"
            }
        )
    ]
    return GeoJSONFeatureCollection(
        type="FeatureCollection",
        features=features,
        properties={"total_detections": len(features), "window_hours": hours}
    )
