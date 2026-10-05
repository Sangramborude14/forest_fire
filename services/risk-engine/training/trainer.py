"""Interfaces for risk model training and evaluation."""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from ..models.base import BaseRiskModel, ModelMetadata


class DatasetPreparer(ABC):
    """Abstract interface for historical dataset compilation and feature matrix assembly."""

    @abstractmethod
    def prepare_training_dataset(self, region_id: str, start_date: str, end_date: str) -> Any:
        """Compile historical burn scars and precursor environmental features."""
        pass


class RiskModelTrainer(ABC):
    """Abstract trainer interface for Random Forest / XGBoost models."""

    @abstractmethod
    def train(self, training_data: Any, hyperparameters: Dict[str, Any]) -> BaseRiskModel:
        """Execute model training and return calibrated BaseRiskModel."""
        pass


class RiskModelEvaluator(ABC):
    """Abstract interface for classification metrics computation."""

    @abstractmethod
    def evaluate(self, model: BaseRiskModel, test_data: Any) -> Dict[str, float]:
        """Compute precision, recall, f1, and roc_auc metrics."""
        pass
