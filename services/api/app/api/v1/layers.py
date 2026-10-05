"""Static and Environmental Layers API router."""

from fastapi import APIRouter, Path, Query, status
from ...schemas.layers import LayerMetadataResponse
from ...core.errors import ValidationException

router = APIRouter(prefix="/layers", tags=["Layers"])

ALLOWED_LAYERS = {"elevation", "slope", "fuel", "weather", "fire-history"}


@router.get(
    "/{layer_type}",
    response_model=LayerMetadataResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Environmental GIS Layer Information & Legend"
)
async def get_layer_metadata(
    layer_type: str = Path(..., description="Layer category: elevation | slope | fuel | weather | fire-history"),
    region_id: str = Query(..., description="Target region UUID"),
) -> LayerMetadataResponse:
    """Retrieve metadata, resolution, and classification legend for static GIS layers."""
    if layer_type.lower() not in ALLOWED_LAYERS:
        raise ValidationException(
            message=f"Invalid layer_type '{layer_type}'. Must be one of: {', '.join(sorted(ALLOWED_LAYERS))}",
            details={"allowed_values": list(ALLOWED_LAYERS)}
        )

    legends = {
        "fuel": {
            "1": "Dense Pine Forest (High Flammability)",
            "2": "Deciduous Broadleaf (Moderate)",
            "3": "Dry Shrubland (High)",
            "4": "Grassland / Agricultural (Low-Moderate)",
        },
        "slope": {
            "1": "0 - 10 deg (Gentle)",
            "2": "10 - 25 deg (Moderate)",
            "3": "25 - 45 deg (Steep)",
            "4": "> 45 deg (Extreme)",
        },
        "elevation": {
            "unit": "meters above sea level",
            "source": "CartoDEM / SRTM 30m"
        },
        "weather": {
            "parameters": "Temperature, Humidity, Wind Vector, FWI",
            "source": "IMD API / ERA5"
        },
        "fire-history": {
            "timespan": "2015-2025 Historical Burn Scars",
            "source": "MODIS Burned Area MCD64A1"
        }
    }

    return LayerMetadataResponse(
        layer_type=layer_type,
        region_id=region_id,
        resolution_meters=500,
        legend=legends.get(layer_type.lower(), {}),
        source="Forest Fire Platform Geodatabase"
    )
