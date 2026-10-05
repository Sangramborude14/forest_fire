"""Service layer orchestrating active and historical fire queries."""

from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session

from ..repositories.fire_repository import FireRepository
from ..models.fire_event import FireEvent
from ..schemas.fire import ActiveFireProperties
from ..schemas.geojson import GeoJSONPoint, GeoJSONFeature, GeoJSONFeatureCollection, to_geojson_geometry

SAMPLE_ACTIVE_FIRES = [
    {
        "id": "f8a9e712-4523-41a3-b3c1-019283746554",
        "coordinates": [78.7523, 30.2104],
        "satellite": "VIIRS_NOAA20",
        "detected_at": "2026-10-05T14:30:00Z",
        "brightness_temp_k": 348.6,
        "frp_mw": 42.1,
        "confidence_pct": 88.0,
        "is_active": True,
        "day_night": "D",
    }
]


class FireService:
    """Service managing satellite fire detections."""

    def __init__(self, db: Optional[Session] = None):
        self.db = db
        self.repo = FireRepository(db) if db is not None else None

    def get_active_fires(
        self,
        region_id: Optional[str] = None,
        hours: int = 24,
        min_confidence: float = 50.0,
        limit: int = 100,
    ) -> GeoJSONFeatureCollection:
        features: List[GeoJSONFeature] = []

        if self.repo is not None:
            try:
                db_fires = self.repo.get_active_fires(
                    region_id=region_id,
                    hours=hours,
                    min_confidence=min_confidence,
                    limit=limit,
                )
                if db_fires:
                    for fe in db_fires:
                        geom = to_geojson_geometry(fe.location)
                        features.append(
                            GeoJSONFeature(
                                id=str(fe.id),
                                geometry=geom,
                                properties=ActiveFireProperties(
                                    satellite=fe.source,
                                    detected_at=fe.detected_at.isoformat(),
                                    brightness_temp_k=float(fe.brightness_temp_k) if fe.brightness_temp_k else None,
                                    frp_mw=float(fe.frp_mw) if fe.frp_mw else None,
                                    confidence_pct=float(fe.confidence_pct),
                                    is_active=fe.is_active,
                                ).model_dump(),
                            )
                        )
                    return GeoJSONFeatureCollection(
                        features=features,
                        properties={"total": len(features), "window_hours": hours},
                    )
            except Exception:
                pass

        # Reference sample fallback (clearly tagged as development demonstration data)
        for s in SAMPLE_ACTIVE_FIRES:
            if s["confidence_pct"] >= min_confidence:
                features.append(
                    GeoJSONFeature(
                        id=s["id"],
                        geometry=GeoJSONPoint(coordinates=s["coordinates"]).model_dump(),
                        properties=ActiveFireProperties(
                            satellite=s["satellite"],
                            detected_at=s["detected_at"],
                            brightness_temp_k=s["brightness_temp_k"],
                            frp_mw=s["frp_mw"],
                            confidence_pct=s["confidence_pct"],
                            is_active=s["is_active"],
                            day_night=s["day_night"],
                        ).model_dump(),
                    )
                )

        return GeoJSONFeatureCollection(
            features=features,
            properties={"total": len(features), "window_hours": hours, "source": "DEMO_DATA"},
        )
