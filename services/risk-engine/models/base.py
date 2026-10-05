"""Base risk model abstract interface."""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from dataclasses import dataclass


@dataclass
class ModelMetadata:
    """Metadata tracking model version, lineage, and training metrics."""
    model_name: str
    model_version: str
    algorithm: str  # e.g., "XGBoost", "RandomForest", "UNet"
    trained_at: Optional[str] = None
    evaluation_metrics: Optional[Dict[str, float]] = None


class BaseRiskModel(ABC):
    """Abstract interface that all 24-hour fire risk models must implement."""

    def __init__(self, metadata: ModelMetadata):
        self.metadata = metadata

    @property
    def model_name(self) -> str:
        return self.metadata.model_name

    @property
    def model_version(self) -> str:
        return self.metadata.model_version

    @abstractmethod
    def predict_susceptibility(self, features: Dict[str, float]) -> float:
        """
        Compute fire susceptibility probability in [0.0, 1.0] for a 500m cell.
        Phase 1 contract only; actual machine learning training deferred to Phase 5.
        """
        pass
