"""Common Pydantic schemas and GeoJSON models."""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ErrorDetail(BaseModel):
    """Inner error payload model."""
    code: str
    message: str
    details: Dict[str, Any] = Field(default_factory=dict)
    request_id: str


class ErrorResponse(BaseModel):
    """Standardized API error envelope."""
    error: ErrorDetail


class ServiceStatus(BaseModel):
    """Service connectivity states."""
    database: str = "connected"
    redis: str = "connected"
    celery_broker: str = "connected"


class HealthResponse(BaseModel):
    """API health response payload."""
    status: str = "healthy"
    timestamp: str
    version: str
    environment: str
    services: ServiceStatus


# GeoJSON Schemas
class GeoJSONPoint(BaseModel):
    """GeoJSON Point geometry."""
    type: str = "Point"
    coordinates: List[float] = Field(..., description="[longitude, latitude]")


class GeoJSONPolygon(BaseModel):
    """GeoJSON Polygon geometry."""
    type: str = "Polygon"
    coordinates: List[List[List[float]]] = Field(..., description="Ring coordinate arrays")


class GeoJSONFeature(BaseModel):
    """GeoJSON Feature envelope."""
    type: str = "Feature"
    id: Optional[str] = None
    geometry: Dict[str, Any]
    properties: Dict[str, Any] = Field(default_factory=dict)


class GeoJSONFeatureCollection(BaseModel):
    """GeoJSON FeatureCollection."""
    type: str = "FeatureCollection"
    features: List[GeoJSONFeature]
    properties: Optional[Dict[str, Any]] = None
