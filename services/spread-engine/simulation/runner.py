"""Simulation runner coordinating fire spread execution."""

from abc import ABC, abstractmethod
from typing import Any, Dict, List
from ..models.config import SimulationInput
from ..simulation.grid import FireGrid, CellState
from ..simulation.timesteps import SimulationResult, TimestepResult
from packages.geo_utils.grid import create_500m_cell_polygon


class BaseSimulationRunner(ABC):
    """Abstract runner contract for fire spread simulation engines."""

    @abstractmethod
    def run_simulation(self, sim_input: SimulationInput) -> SimulationResult:
        """
        Execute fire spread simulation for the requested duration.
        Phase 1 provides structural contract execution.
        """
        pass


class CellularAutomataRunner(BaseSimulationRunner):
    """
    Cellular Automata simulation runner.
    Phase 1 establishes clean architectural execution and output contracts.
    Real CA propagation rules and Rothermel calibration are implemented in Phase 7.
    """

    def run_simulation(self, sim_input: SimulationInput) -> SimulationResult:
        grid = FireGrid(
            rows=sim_input.grid_rows,
            cols=sim_input.grid_cols,
            resolution_meters=sim_input.grid_resolution_meters
        )

        # Set initial ignition cell
        center_r = sim_input.grid_rows // 2
        center_c = sim_input.grid_cols // 2
        grid.set_cell_state(center_r, center_c, CellState.BURNING)

        timesteps: List[TimestepResult] = []
        cell_area_ha = (sim_input.grid_resolution_meters ** 2) / 10000.0  # 25 ha for 500m cell

        # Generate structural timesteps adhering strictly to contract
        for hour in range(1, sim_input.duration_hours + 1):
            boundary = create_500m_cell_polygon(
                center_lat=sim_input.ignition_lat,
                center_lon=sim_input.ignition_lon,
                resolution_meters=sim_input.grid_resolution_meters * (hour * 0.5 + 1.0)
            )
            timesteps.append(
                TimestepResult(
                    step_hour=hour,
                    burned_area_ha=round(hour * cell_area_ha, 2),
                    spread_velocity_kmh=0.75,
                    spread_direction_deg=sim_input.environment.wind_direction_deg if sim_input.environment else 45.0,
                    intensity_mw=round(4.0 + hour * 0.5, 2),
                    boundary_polygon=boundary
                )
            )

        total_burned = timesteps[-1].burned_area_ha if timesteps else 0.0

        return SimulationResult(
            simulation_id=sim_input.simulation_id,
            total_area_burned_ha=total_burned,
            duration_hours=sim_input.duration_hours,
            peak_spread_velocity_kmh=0.75,
            timesteps=timesteps
        )
