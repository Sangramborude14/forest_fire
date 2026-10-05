"""Regions API router."""

from typing import Optional
from fastapi import APIRouter, Query, Path, status
from ...schemas.regions import RegionListResponse, RegionDetailResponse, RegionListItem
from ...schemas.common import GeoJSONPoint, GeoJSONFeature
from ...core.errors import ResourceNotFoundException

router = APIRouter(prefix="/regions", tags=["Regions"])

# Seed reference data for Phase 1 contract compliance
SAMPLE_REGIONS = [
    RegionListItem(
        id="3fa85f64-5717-4562-b3fc-2c963f66afa6",
        code="UTTARAKHAND_GARHWAL",
        name="Garhwal Forest Division",
        state="Uttarakhand",
        area_sqkm=2840.5,
        centroid=GeoJSONPoint(type="Point", coordinates=[78.7842, 30.2241]),
        created_at="2026-01-15T00:00:00Z"
    ),
    RegionListItem(
        id="7ca85f64-5717-4562-b3fc-2c963f66afa7",
        code="WESTERN_GHATS_WAYANAD",
        name="Wayanad Wildlife Sanctuary",
        state="Kerala",
        area_sqkm=344.4,
        centroid=GeoJSONPoint(type="Point", coordinates=[76.2418, 11.6854]),
        created_at="2026-01-15T00:00:00Z"
    )
]


@router.get(
    "",
    response_model=RegionListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Monitored Forest Regions"
)
async def list_regions(
    state: Optional[str] = Query(None, description="Filter regions by state"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> RegionListResponse:
    """Retrieve list of monitored forest divisions and jurisdictions."""
    results = SAMPLE_REGIONS
    if state:
        results = [r for r in results if r.state.lower() == state.lower()]
    paginated = results[offset : offset + limit]
    return RegionListResponse(count=len(results), results=paginated)


@router.get(
    "/{region_id}",
    response_model=RegionDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Region Details & Boundary Geometry"
)
async def get_region(
    region_id: str = Path(..., description="Region UUID or unique code")
) -> RegionDetailResponse:
    """Retrieve detailed regional metadata and GeoJSON boundary."""
    match = next(
        (r for r in SAMPLE_REGIONS if r.id == region_id or r.code == region_id),
        None
    )
    if not match:
        raise ResourceNotFoundException(f"Region '{region_id}' was not found.")

    return RegionDetailResponse(
        id=match.id,
        code=match.code,
        name=match.name,
        state=match.state,
        area_sqkm=match.area_sqkm,
        boundary=GeoJSONFeature(
            type="Feature",
            geometry={
                "type": "Polygon",
                "coordinates": [
                    [
                        [78.50, 30.10],
                        [79.10, 30.10],
                        [79.10, 30.40],
                        [78.50, 30.40],
                        [78.50, 30.10]
                    ]
                ]
            },
            properties={"code": match.code, "name": match.name}
        ),
        grid_resolution_meters=500,
        total_cells=11362
    )
