"""Repository for fire spread simulation sessions and timesteps."""

import uuid
from typing import List, Optional, Any
from sqlalchemy.orm import Session
from ..models.simulation import Simulation
from ..models.simulation_step import SimulationStep
from .base_repository import BaseRepository


class SimulationRepository(BaseRepository[Simulation]):
    """Database repository for simulations."""

    def __init__(self, db: Session):
        super().__init__(db, Simulation)

    def get_by_id(self, simulation_id: Any) -> Optional[Simulation]:
        try:
            sim_uuid = uuid.UUID(str(simulation_id))
            return self.db.query(Simulation).filter(Simulation.id == sim_uuid).first()
        except (ValueError, AttributeError):
            return None

    def get_steps(self, simulation_id: Any) -> List[SimulationStep]:
        try:
            sim_uuid = uuid.UUID(str(simulation_id))
            return (
                self.db.query(SimulationStep)
                .filter(SimulationStep.simulation_id == sim_uuid)
                .order_by(SimulationStep.step_hour.asc())
                .all()
            )
        except (ValueError, AttributeError):
            return []

    def get_step(self, simulation_id: Any, hour: int) -> Optional[SimulationStep]:
        try:
            sim_uuid = uuid.UUID(str(simulation_id))
            return (
                self.db.query(SimulationStep)
                .filter(SimulationStep.simulation_id == sim_uuid, SimulationStep.step_hour == hour)
                .first()
            )
        except (ValueError, AttributeError):
            return None

    def add_step(self, step: SimulationStep) -> SimulationStep:
        self.db.add(step)
        self.db.flush()
        return step
