"""Fire Spread Simulation API router."""

import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Path, status
from ...schemas.simulations import (
    SimulationCreateRequest,
    SimulationCreateResponse,
    SimulationStatusResponse,
    SimulationTimelineResponse,
    SimulationTimestepDetailResponse,
    SimulationTimestepItem,
    SimulationMetrics,
)
from ...schemas.common import GeoJSONPoint, GeoJSONFeature
from ...core.errors import ResourceNotFoundException

router = APIRouter(prefix="/simulations", tags=["Fire Spread Simulations"])


@router.post(
    "",
    response_model=SimulationCreateResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Initiate 12-Hour Fire Spread Simulation"
)
async def create_simulation(
    request: SimulationCreateRequest
) -> SimulationCreateResponse:
    """
    Accept an ignition point and environmental parameters, queue an
    asynchronous Cellular Automata spread simulation job, and return tracking ID.
    """
    sim_id = str(uuid.uuid4())
    return SimulationCreateResponse(
        simulation_id=sim_id,
        status="PENDING",
        created_at=datetime.now(timezone.utc).isoformat(),
        duration_hours=request.duration_hours,
        poll_url=f"/api/v1/simulations/{sim_id}"
    )


@router.get(
    "/{simulation_id}",
    response_model=SimulationStatusResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Simulation Lifecycle Status & Metrics"
)
async def get_simulation_status(
    simulation_id: str = Path(..., description="Simulation UUID")
) -> SimulationStatusResponse:
    """Retrieve current processing progress or completed metrics for a simulation job."""
    return SimulationStatusResponse(
        simulation_id=simulation_id,
        status="COMPLETED",
        progress_pct=100.0,
        duration_hours=12,
        created_at=datetime.now(timezone.utc).isoformat(),
        completed_at=datetime.now(timezone.utc).isoformat(),
        ignition_point=GeoJSONPoint(type="Point", coordinates=[78.7523, 30.2104]),
        metrics=SimulationMetrics(
            total_area_burned_ha=412.5,
            peak_spread_velocity_kmh=1.45,
            dominant_spread_direction_deg=65.0
        )
    )


@router.get(
    "/{simulation_id}/timeline",
    response_model=SimulationTimelineResponse,
    status_code=status.HTTP_200_OK,
    summary="Get 12-Hour Spread Timeline Progression"
)
async def get_simulation_timeline(
    simulation_id: str = Path(..., description="Simulation UUID")
) -> SimulationTimelineResponse:
    """Retrieve hourly burned area, velocity, and intensity metrics for all 12 timesteps."""
    sample_steps = [
        SimulationTimestepItem(
            step_hour=h,
            burned_area_ha=round(h * 34.2, 2),
            spread_velocity_kmh=round(0.8 + (h * 0.05), 2),
            spread_direction_deg=62.0,
            intensity_mw=round(5.0 + (h * 0.8), 2)
        )
        for h in range(1, 13)
    ]
    return SimulationTimelineResponse(
        simulation_id=simulation_id,
        total_steps=12,
        timeline=sample_steps
    )


@router.get(
    "/{simulation_id}/timesteps/{hour}",
    response_model=SimulationTimestepDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Spatial Boundary for Specific Simulation Hour"
)
async def get_simulation_timestep(
    simulation_id: str = Path(..., description="Simulation UUID"),
    hour: int = Path(..., ge=1, le=12, description="Timestep hour (1-12)")
) -> SimulationTimestepDetailResponse:
    """Retrieve GeoJSON boundary perimeter for a specific hour of the fire spread."""
    delta = 0.005 * hour
    perimeter_feature = GeoJSONFeature(
        type="Feature",
        id=f"sim-{simulation_id}-step-{hour}",
        geometry={
            "type": "Polygon",
            "coordinates": [
                [
                    [78.750, 30.210],
                    [78.750 + delta, 30.210 + delta],
                    [78.755 + delta, 30.215 + delta],
                    [78.755, 30.210],
                    [78.750, 30.210]
                ]
            ]
        },
        properties={"hour": hour, "area_ha": round(hour * 34.2, 2)}
    )
    return SimulationTimestepDetailResponse(
        simulation_id=simulation_id,
        step_hour=hour,
        metrics=SimulationTimestepItem(
            step_hour=hour,
            burned_area_ha=round(hour * 34.2, 2),
            spread_velocity_kmh=round(0.8 + (hour * 0.05), 2),
            spread_direction_deg=62.0,
            intensity_mw=round(5.0 + (hour * 0.8), 2)
        ),
        perimeter=perimeter_feature
    )
