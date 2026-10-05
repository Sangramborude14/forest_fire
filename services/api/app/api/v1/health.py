"""System health check endpoint."""

from datetime import datetime, timezone
from fastapi import APIRouter, status
from ...core.config import settings
from ...core.database import check_db_connection
from ...core.celery_app import check_celery_broker
from ...schemas.common import HealthResponse, ServiceStatus

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="System Health & Dependency Connectivity Check"
)
async def get_health() -> HealthResponse:
    """
    Verify API service operational status, software version, environment,
    and connectivity to backing infrastructure (PostGIS, Redis, Celery).
    """
    db_status = check_db_connection()
    celery_status = check_celery_broker()

    return HealthResponse(
        status="healthy",
        timestamp=datetime.now(timezone.utc).isoformat(),
        version=settings.APP_VERSION,
        environment=settings.APP_ENV,
        services=ServiceStatus(
            database=db_status,
            redis=celery_status,
            celery_broker=celery_status,
        ),
    )
