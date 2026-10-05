"""Schemas for 24-hour Fire Risk endpoints."""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from .common import GeoJSONPolygon, GeoJSONFeatureCollection


class RiskCellProperties(BaseModel):
    """Properties for a 500m risk grid cell."""
    grid_cell_id: str
    risk_probability: float
    risk_class: str
    fwi: Optional[float] = None
    fuel_type: Optional[str] = None
    elevation_m: Optional[float] = None


class RiskPredictRequest(BaseModel):
    """Payload to trigger an on-demand risk prediction run."""
    region_id: str
    target_date: str
    force_recompute: bool = False
    model_name: str = "xgboost-baseline"


class RiskPredictResponse(BaseModel):
    """Response returned upon triggering a prediction run."""
    job_id: str
    region_id: str
    target_date: str
    status: str
    cells_predicted: int
    mean_risk_probability: float
    completed_at: str
