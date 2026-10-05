"""Abstract base interfaces for external data adapters."""

from abc import ABC, abstractmethod
from datetime import datetime, date
from typing import Any, Dict, List, Optional
from dataclasses import dataclass


@dataclass
class BoundingBox:
    """Geographic bounding box in EPSG:4326."""
    min_lon: float
    min_lat: float
    max_lon: float
    max_lat: float


class BaseDataSource(ABC):
    """Abstract base class for all external data sources."""

    @property
    @abstractmethod
    def source_name(self) -> str:
        """Name of the data source provider."""
        pass

    @abstractmethod
    def validate_connection(self) -> bool:
        """Check availability/credentials of the data source."""
        pass


class FireDataSource(BaseDataSource):
    """Interface for active fire / thermal anomaly satellite data."""

    @abstractmethod
    def fetch_active_fires(
        self,
        bbox: BoundingBox,
        start_time: datetime,
        end_time: datetime,
        min_confidence: float = 50.0
    ) -> List[Dict[str, Any]]:
        """Fetch active fire detections within geographic extent and time window."""
        pass


class WeatherDataSource(BaseDataSource):
    """Interface for meteorological observations and numerical forecasts."""

    @abstractmethod
    def fetch_weather_grid(
        self,
        bbox: BoundingBox,
        target_date: date,
        variables: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Fetch meteorological metrics (temperature, humidity, wind, precipitation)."""
        pass


class VegetationDataSource(BaseDataSource):
    """Interface for multispectral optical satellite vegetation/fuel imagery."""

    @abstractmethod
    def fetch_vegetation_indices(
        self,
        bbox: BoundingBox,
        target_date: date
    ) -> Dict[str, Any]:
        """Fetch surface reflectance indices (NDVI, NDWI, land cover)."""
        pass


class TerrainDataSource(BaseDataSource):
    """Interface for Digital Elevation Models (DEM)."""

    @abstractmethod
    def fetch_elevation_model(
        self,
        bbox: BoundingBox
    ) -> Dict[str, Any]:
        """Fetch elevation, slope gradient, and aspect rasters."""
        pass
