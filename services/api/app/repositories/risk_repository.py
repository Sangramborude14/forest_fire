"""Repository for 24-hour fire risk predictions."""

import uuid
from datetime import date
from typing import List, Optional, Any
from sqlalchemy.orm import Session
from ..models.risk_prediction import RiskPrediction
from ..models.grid_cell import GridCell
from .base_repository import BaseRepository


class RiskRepository(BaseRepository[RiskPrediction]):
    """Database repository for risk predictions."""

    def __init__(self, db: Session):
        super().__init__(db, RiskPrediction)

    def get_predictions_by_region(
        self,
        region_id: Any,
        target_date: Optional[date] = None,
        min_risk: Optional[str] = None,
        limit: int = 500
    ) -> List[RiskPrediction]:
        query = self.db.query(RiskPrediction).filter(RiskPrediction.region_id == region_id)

        if target_date:
            query = query.filter(RiskPrediction.valid_for_date == target_date)

        if min_risk:
            # Map risk levels to threshold
            risk_order = {"LOW": 0.0, "MODERATE": 0.25, "HIGH": 0.50, "EXTREME": 0.75}
            threshold = risk_order.get(min_risk.upper(), 0.0)
            query = query.filter(RiskPrediction.risk_probability >= threshold)

        return query.order_by(RiskPrediction.risk_probability.desc()).limit(limit).all()
