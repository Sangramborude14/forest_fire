"""Data pipeline adapters package."""

from .base import (
    BoundingBox,
    BaseDataSource,
    FireDataSource,
    WeatherDataSource,
    VegetationDataSource,
    TerrainDataSource,
)
from .sample_adapters import (
    SampleModisFireAdapter,
    SampleImdWeatherAdapter,
    SampleSentinelVegetationAdapter,
    SampleCartoDemTerrainAdapter,
)

__all__ = [
    "BoundingBox",
    "BaseDataSource",
    "FireDataSource",
    "WeatherDataSource",
    "VegetationDataSource",
    "TerrainDataSource",
    "SampleModisFireAdapter",
    "SampleImdWeatherAdapter",
    "SampleSentinelVegetationAdapter",
    "SampleCartoDemTerrainAdapter",
]
