"""Celery background tasks for fire spread simulation and batch preprocessing."""

import time
from typing import Any, Dict
from ..core.celery_app import celery_app
from ..core.logging import logger


@celery_app.task(name="services.api.app.tasks.simulation_tasks.run_fire_spread_simulation", bind=True)
def run_fire_spread_simulation(self, simulation_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Celery task orchestrating a 12-hour Cellular Automata fire spread simulation.
    In Phase 1, this validates worker execution and task discovery without executing
    fake or uncalibrated real-world physics.
    """
    logger.info(f"Starting async simulation task for job: {simulation_id}")

    # Simulated worker lifecycle heartbeat
    self.update_state(state="RUNNING", meta={"simulation_id": simulation_id, "progress_pct": 10.0})

    return {
        "simulation_id": simulation_id,
        "status": "COMPLETED",
        "processed_by": "celery_worker",
        "timestamp": time.time()
    }


@celery_app.task(name="services.api.app.tasks.simulation_tasks.ping_task")
def ping_task() -> str:
    """Simple verification task to confirm worker connectivity and discovery."""
    return "pong"
