"""Simulation timestep output contracts."""

from dataclasses import dataclass
from typing import Any, Dict, List


@dataclass
class TimestepResult:
    """Snapshot metrics and spatial boundary for a single simulation hour."""
    step_hour: int
    burned_area_ha: float
    spread_velocity_kmh: float
    spread_direction_deg: float
    intensity_mw: float
    boundary_polygon: Dict[str, Any]  # GeoJSON Polygon


@dataclass
class SimulationResult:
    """Complete 12-hour simulation result container."""
    simulation_id: str
    total_area_burned_ha: float
    duration_hours: int
    peak_spread_velocity_kmh: float
    timesteps: List[TimestepResult]
