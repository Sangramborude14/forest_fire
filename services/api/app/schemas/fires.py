"""Schemas for Active Fire Hotspot endpoints."""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from .common import GeoJSONPoint, GeoJSONFeatureCollection


class ActiveFireProperties(BaseModel):
    """Properties for active fire satellite hotspot."""
    satellite: str
    detected_at: str
    brightness_temp_k: Optional[float] = None
    frp_mw: Optional[float] = None
    confidence_pct: float
    day_night: Optional[str] = "D"


class ActiveFireFeature(BaseModel):
    """Feature envelope for an active fire point."""
    type: str = "Feature"
    id: str
    geometry: GeoJSONPoint
    properties: ActiveFireProperties
