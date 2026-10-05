"""Feature validation and normalization contracts for risk inference."""

from typing import Any, Dict, List, Set


REQUIRED_RISK_FEATURES: Set[str] = {
    "elevation_m",
    "slope_deg",
    "temperature_c",
    "relative_humidity_pct",
    "wind_speed_ms",
    "ndvi",
    "fwi",
}


class RiskFeatureValidator:
    """Validates presence and numerical integrity of features before inference."""

    @staticmethod
    def validate_features(features: Dict[str, float]) -> List[str]:
        """
        Validate that all required features are present and within valid ranges.
        Returns list of validation error descriptions (empty if valid).
        """
        errors: List[str] = []

        missing = REQUIRED_RISK_FEATURES - set(features.keys())
        if missing:
            errors.append(f"Missing required features: {sorted(list(missing))}")
            return errors

        if not (0.0 <= features["slope_deg"] <= 90.0):
            errors.append(f"slope_deg out of range [0, 90]: {features['slope_deg']}")

        if not (0.0 <= features["relative_humidity_pct"] <= 100.0):
            errors.append(f"relative_humidity_pct out of range [0, 100]: {features['relative_humidity_pct']}")

        if not (-1.0 <= features["ndvi"] <= 1.0):
            errors.append(f"ndvi out of range [-1, 1]: {features['ndvi']}")

        if features["fwi"] < 0.0:
            errors.append(f"fwi cannot be negative: {features['fwi']}")

        return errors
