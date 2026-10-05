"""Inference interface for 24-hour fire risk prediction."""

from dataclasses import dataclass
from typing import Any, Dict, Optional
from ..models.base import BaseRiskModel
from ..features.validator import RiskFeatureValidator
from packages.shared_types.contracts import RiskClass, RiskPredictionContract


@dataclass
class RiskInferenceInput:
    """Canonical input structure for cell-level risk inference."""
    grid_cell_id: str
    features: Dict[str, float]
    region_id: Optional[str] = None


class RiskPredictor:
    """
    Orchestrates pre-inference validation and executes the designated
    risk model. Phase 1 provides interface validation without fake AI predictions.
    """

    def __init__(self, model: BaseRiskModel):
        self.model = model

    @staticmethod
    def classify_probability(prob: float) -> RiskClass:
        """Categorize continuous probability into discrete risk class."""
        if prob < 0.25:
            return RiskClass.LOW
        elif prob < 0.50:
            return RiskClass.MODERATE
        elif prob < 0.75:
            return RiskClass.HIGH
        else:
            return RiskClass.EXTREME

    def predict_risk(self, inference_input: RiskInferenceInput) -> RiskPredictionContract:
        """
        Validate inputs and invoke model to produce canonical RiskPredictionContract.
        """
        errors = RiskFeatureValidator.validate_features(inference_input.features)
        if errors:
            raise ValueError(f"Feature validation failed: {'; '.join(errors)}")

        probability = self.model.predict_susceptibility(inference_input.features)
        risk_class = self.classify_probability(probability)

        return RiskPredictionContract(
            grid_cell_id=inference_input.grid_cell_id,
            probability=probability,
            risk_class=risk_class,
            model_version=self.model.model_version,
            region_id=inference_input.region_id,
        )
