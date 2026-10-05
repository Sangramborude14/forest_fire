"""Fire grid state representation and cell discrete states."""

from enum import IntEnum
from typing import List, Tuple, Dict, Any


class CellState(IntEnum):
    """Discrete state of a spatial grid cell in Cellular Automata."""
    UNBURNED = 0
    BURNING = 1
    BURNED = 2


class FireGrid:
    """2D spatial grid representation for fire propagation."""

    def __init__(self, rows: int, cols: int, resolution_meters: int = 500):
        self.rows = rows
        self.cols = cols
        self.resolution_meters = resolution_meters
        # Initialize all cells to UNBURNED
        self.matrix: List[List[CellState]] = [
            [CellState.UNBURNED for _ in range(cols)] for _ in range(rows)
        ]

    def set_cell_state(self, r: int, c: int, state: CellState) -> None:
        """Update the state of a specific cell coordinate."""
        if 0 <= r < self.rows and 0 <= c < self.cols:
            self.matrix[r][c] = state

    def get_cell_state(self, r: int, c: int) -> CellState:
        """Query state of a cell."""
        if 0 <= r < self.rows and 0 <= c < self.cols:
            return self.matrix[r][c]
        raise IndexError(f"Cell ({r}, {c}) is out of bounds for grid of size ({self.rows}, {self.cols})")

    def count_by_state(self) -> Dict[CellState, int]:
        """Aggregate count of cells by state."""
        counts = {CellState.UNBURNED: 0, CellState.BURNING: 0, CellState.BURNED: 0}
        for row in self.matrix:
            for cell in row:
                counts[cell] += 1
        return counts
