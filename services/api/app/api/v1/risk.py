"""Fire Risk Prediction API router."""

from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Path, Query, status
from ...schemas.risk import RiskPredictRequest, RiskPredictResponse
from ...schemas.common import GeoJSONFeatureCollection, GeoJSONFeature

router = APIRouter(prefix="/risk", tags=["Fire Risk"])


@router.get(
    "/{region_id}",
    response_model=GeoJSONFeatureCollection,
    status_code=status.HTTP_200_OK,
    summary="Get 24-Hour Fire Risk Grid Layer"
)
async def get_risk_layer(
    region_id: str = Path(..., description="Region UUID or code"),
    date: Optional[str] = Query(None, description="Forecast date (YYYY-MM-DD)"),
    min_risk: Optional[str] = Query(None, description="Filter minimum risk level (LOW, MODERATE, HIGH, EXTREME)"),
) -> GeoJSONFeatureCollection:
    """
    Retrieve 24-hour fire susceptibility predictions for 500m cells
    in the designated region formatted as a GeoJSON FeatureCollection.
    """
    sample_feature = GeoJSONFeature(
        type="Feature",
        id="cell-gar-00129",
        geometry={
            "type": "Polygon",
            "coordinates": [
                [
                    [78.750, 30.200],
                    [78.755, 30.200],
                    [78.755, 30.205],
                    [78.750, 30.205],
                    [78.750, 30.200]
                ]
            ]
        },
        properties={
            "grid_cell_id": "9bc12345-0000-0000-0000-000000000129",
            "risk_probability": 0.82,
            "risk_class": "EXTREME",
            "fwi": 28.4,
            "fuel_type": "Chir_Pine",
            "elevation_m": 1420
        }
    )
    return GeoJSONFeatureCollection(
        type="FeatureCollection",
        features=[sample_feature],
        properties={
            "region_id": region_id,
            "forecast_date": date or "2026-10-06",
            "model_version": "baseline-contract-v1",
            "generated_at": datetime.now(timezone.utc).isoformat()
        }
    )


@router.post(
    "/predict",
    response_model=RiskPredictResponse,
    status_code=status.HTTP_200_OK,
    summary="Trigger On-Demand Risk Prediction Inference"
)
async def predict_risk(
    request: RiskPredictRequest
) -> RiskPredictResponse:
    """
    Execute or retrieve on-demand 24-hour fire susceptibility scoring
    for the selected region using the designated model pipeline.
    """
    return RiskPredictResponse(
        job_id="risk-job-contract-01",
        region_id=request.region_id,
        target_date=request.target_date,
        status="COMPLETED",
        cells_predicted=11362,
        mean_risk_probability=0.34,
        completed_at=datetime.now(timezone.utc).isoformat()
    )
