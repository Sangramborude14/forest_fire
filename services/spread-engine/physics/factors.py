"""Spread influence factors interface: wind, slope, aspect, and fuel."""

from abc import ABC, abstractmethod
from typing import Dict, Any


class SpreadFactors(ABC):
    """Abstract interface calculating propagation coefficients from terrain and meteorology."""

    @abstractmethod
    def calculate_wind_factor(self, wind_speed_ms: float, wind_dir_deg: float, propagation_angle_deg: float) -> float:
        """Calculate directional spread amplification from wind vector."""
        pass

    @abstractmethod
    def calculate_slope_factor(self, slope_deg: float, aspect_deg: float, propagation_angle_deg: float) -> float:
        """Calculate uphill acceleration vs downhill retardation factor."""
        pass

    @abstractmethod
    def calculate_fuel_factor(self, fuel_type: str) -> float:
        """Calculate combustibility coefficient for specified fuel model."""
        pass
