"""Schemas for 12-hour Fire Spread Simulation endpoints."""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from .common import GeoJSONPoint, GeoJSONPolygon, GeoJSONFeature


class IgnitionPointInput(BaseModel):
    """Input coordinates for simulation ignition origin."""
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)


class WeatherScenarioInput(BaseModel):
    """Optional meteorological scenario overrides."""
    wind_speed_ms: Optional[float] = Field(default=5.0, ge=0.0)
    wind_direction_deg: Optional[float] = Field(default=0.0, ge=0.0, le=360.0)
    temperature_c: Optional[float] = 30.0
    relative_humidity_pct: Optional[float] = Field(default=25.0, ge=0.0, le=100.0)


class SimulationCreateRequest(BaseModel):
    """Payload to initiate a 12-hour simulation job."""
    region_id: str
    ignition_point: IgnitionPointInput
    ignition_time: str
    duration_hours: int = Field(default=12, ge=1, le=12)
    weather_scenario: Optional[WeatherScenarioInput] = None


class SimulationCreateResponse(BaseModel):
    """Response returned upon successfully enqueuing a simulation."""
    simulation_id: str
    status: str
    created_at: str
    duration_hours: int
    poll_url: str


class SimulationMetrics(BaseModel):
    """Summary metrics of completed simulation."""
    total_area_burned_ha: float
    peak_spread_velocity_kmh: float
    dominant_spread_direction_deg: float


class SimulationStatusResponse(BaseModel):
    """Status tracking payload."""
    simulation_id: str
    status: str
    progress_pct: float
    duration_hours: int
    created_at: str
    completed_at: Optional[str] = None
    ignition_point: GeoJSONPoint
    metrics: Optional[SimulationMetrics] = None


class SimulationTimestepItem(BaseModel):
    """Item in the 12-hour progression timeline."""
    step_hour: int
    burned_area_ha: float
    spread_velocity_kmh: float
    spread_direction_deg: float
    intensity_mw: float


class SimulationTimelineResponse(BaseModel):
    """Full 12-hour progression metrics timeline."""
    simulation_id: str
    total_steps: int
    timeline: List[SimulationTimestepItem]


class SimulationTimestepDetailResponse(BaseModel):
    """Detailed spatial boundary for a specific timestep hour."""
    simulation_id: str
    step_hour: int
    metrics: SimulationTimestepItem
    perimeter: GeoJSONFeature
