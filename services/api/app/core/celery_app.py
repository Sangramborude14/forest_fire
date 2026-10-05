"""Celery distributed task queue application initialization."""

from celery import Celery
from .config import settings
from .logging import logger

celery_app = Celery(
    "forest_fire_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["services.api.app.tasks.simulation_tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,  # 1 hour max simulation limit
    imports=["services.api.app.tasks.simulation_tasks"]
)
celery_app.autodiscover_tasks(["services.api.app.tasks"])


def check_celery_broker() -> str:
    """Check connectivity to Redis broker."""
    try:
        import redis
        client = redis.from_url(settings.REDIS_URL, socket_timeout=1)
        client.ping()
        return "connected"
    except Exception as e:
        logger.debug(f"Redis/Celery broker check failed: {e}")
        return "unreachable"
