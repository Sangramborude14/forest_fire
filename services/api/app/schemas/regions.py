"""Schemas for Region endpoints."""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from .common import GeoJSONPoint, GeoJSONFeature


class RegionListItem(BaseModel):
    """Summary item for region listing."""
    id: str
    code: str
    name: str
    state: str
    area_sqkm: float
    centroid: GeoJSONPoint
    created_at: Optional[str] = None


class RegionListResponse(BaseModel):
    """Paginated list of regions."""
    count: int
    results: List[RegionListItem]


class RegionDetailResponse(BaseModel):
    """Detailed regional metadata with boundary."""
    id: str
    code: str
    name: str
    state: str
    area_sqkm: float
    boundary: GeoJSONFeature
    grid_resolution_meters: int = 500
    total_cells: int
