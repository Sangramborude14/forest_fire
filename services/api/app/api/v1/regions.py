"""Regions API router delegating to RegionService."""

from typing import Optional
from fastapi import APIRouter, Query, Path, Depends, status
from ...schemas.region import RegionListResponse, RegionDetailResponse
from ...services.region_service import RegionService
from ...dependencies.services import get_region_service

router = APIRouter(prefix="/regions", tags=["Regions"])


@router.get(
    "",
    response_model=RegionListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Monitored Forest Regions"
)
async def list_regions(
    state: Optional[str] = Query(None, description="Filter regions by state"),
    limit: int = Query(50, ge=1, le=100, description="Pagination page limit"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    service: RegionService = Depends(get_region_service),
) -> RegionListResponse:
    """Retrieve list of monitored forest divisions and jurisdictions."""
    return service.list_regions(state=state, limit=limit, offset=offset)


@router.get(
    "/{region_id}",
    response_model=RegionDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Region Details & Boundary Geometry"
)
async def get_region(
    region_id: str = Path(..., description="Region UUID or unique code"),
    service: RegionService = Depends(get_region_service),
) -> RegionDetailResponse:
    """Retrieve detailed regional metadata and PostGIS GeoJSON boundary."""
    return service.get_region(region_id)
