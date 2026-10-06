# 10-Phase Project Implementation Plan

This roadmap governs the end-to-end development of the **Predictive Forest Fire Risk & Spread Simulation Platform**, derived from the ISRO Forest Fire Prediction Technical Blueprint and modern geospatial software architecture standards.

---

### Phase 1: Architecture, Project Foundation & Development Setup [COMPLETED]
- **Objectives**: Establish modular monorepo architecture, formal documentation, typed API and data contracts, PostGIS database schema, React shell, FastAPI skeleton, Celery configuration, Docker Compose environment, and automated test foundation.
- **Deliverables**:
  - `ARCHITECTURE.md`, `API_CONTRACT.md`, `DATA_CONTRACTS.md`, `DATABASE_SCHEMA.md`, `DEVELOPMENT.md`, `IMPLEMENTATION_PLAN.md`.
  - Directory structure and service boundaries.
  - FastAPI `/api/v1/health` endpoint and core middlewares.
  - React + TypeScript application shell with GIS map container and navigation.
  - Data pipeline, Risk engine, Spread engine abstract interfaces.
  - PostGIS DDL script and sample seed data.
  - Docker Compose configuration and automated tests.

---

### Phase 2: Backend, Database & API Implementation [COMPLETED]
- **Objectives**: Implement full relational data models, SQLAlchemy / GeoAlchemy2 integration, repositories, service layer, and concrete REST endpoints.
- **Deliverables**:
  - Region querying and spatial bounding endpoints (`/api/v1/regions`).
  - Active fire hotspots ingestion and querying endpoints (`/api/v1/fires/active`).
  - Simulation job submission and lifecycle tracking endpoints (`/api/v1/simulations`).
  - 24-hour risk prediction endpoints and GIS layer metadata (`/api/v1/risk`, `/api/v1/layers`).
  - Alembic migrations (`0001_initial_postgis_schema.py`) and programmatic database seeding (`python -m services.api.app.seed`).
  - RFC 7807-compliant error handlers, `X-Request-ID` tracing, and GeoJSON spatial response serialization.

---

### Phase 3: Frontend & GIS Foundation [COMPLETED]
- **Objectives**: Build high-performance interactive GIS client using React, Leaflet, Tailwind CSS, and feature-driven architecture.
- **Deliverables**:
  - Modular feature architecture (`src/features/map`, `risk`, `fire`, `simulation`, `regions`, `layers`, `dashboard`).
  - Interactive Leaflet GIS map with Basemap switcher (Dark Matter, Satellite, OSM), MapControls, LayerControls, and MapLegend.
  - Monitored region selector integrated with backend (`/api/v1/regions`, `/api/v1/regions/{id}/boundary`) with automatic viewport centering.
  - Active satellite fire hotspots visualization (`/api/v1/fires/active`) with animated pulse markers, FRP telemetry popups, and list-map bidirectional selection.
  - 24-hour risk susceptibility visualization (`/api/v1/risk/{region_id}`) with 500m grid cell inspection and regional summary distributions.
  - 12-hour Cellular Automata simulation interface with map-click ignition point selection, duration scrub slider, and 0-12h timeline playback controls.
  - Environmental layers catalog (`/api/v1/layers`) distinguishing operational layers from upcoming Phase 4 pipelines.
  - Typed central API client layer with RFC 7807 problem details parsing and timeout management.
  - Comprehensive unit and integration test suite (25/25 tests passing in Vitest).


---

### Phase 4: Data Ingestion & Preprocessing Pipeline [COMPLETED]
- **Objectives**: Implement automated adapters for satellite, meteorological, vegetation, and terrain datasets, normalizing all inputs to a 500m × 500m common spatial grid without temporal leakage.
- **Deliverables**:
  - Source Adapters: NASA MODIS (`ModisFireAdapter`), VIIRS (`ViirsFireAdapter`), ISRO INSAT-3D (`InsatFireAdapter`), ECMWF ERA5 (`Era5WeatherAdapter`), IMD (`ImdWeatherAdapter`), Sentinel-2 (`SentinelVegetationAdapter`), Landsat-8 (`LandsatVegetationAdapter`), ISRO Bhuvan (`BhuvanVegetationAdapter`), NASA SRTM (`SrtmTerrainAdapter`), ISRO CartoDEM (`CartoDemTerrainAdapter`).
  - Spatial Reference & Grid: Dynamic UTM metric CRS projection discovery (`CrsManager`), regular 500m × 500m cell generator (`GridGenerator`), and R-tree spatial indexing (`SpatialGridIndex`).
  - Spatial & Temporal Alignment: IDW spatial interpolation (`SpatialAligner`), daily temporal compositing, and strict anti-leakage guards raising `DataLeakageError` on future observations (`TemporalAligner`).
  - Feature Engineering: Spectral indices (NDVI, NDWI), fuel categorization (`standardize_fuel_class`), continuous cyclical aspect sin/cos, orthogonal U/V wind decomposition, and full Canadian Fire Weather Index equations (`FwiCalculator`).
  - Missing Data & Auditing: Traceable imputation with flags (`imputed_fields`), out-of-bounds physical clamping, and automated quality reporting (`QualityReport`, `QualityReportWriter`).
  - Model-Ready Outputs & Provenance: CSV, Parquet, and GeoJSON writers (`DatasetWriter`), reproducible run manifest (`ManifestBuilder`), and deterministic sample datasets for Uttarakhand/Garhwal.
  - End-to-end CLI & Test Suite: Command-line runner (`services.data_pipeline.cli`), 22 comprehensive pipeline tests (60/60 total monorepo tests passing).

---

### Phase 5: 24-Hour Fire Risk Machine Learning Model [COMPLETED]
- **Objectives**: Develop, train, evaluate, and serialize baseline tabular/pixel-wise machine learning models for 24-hour fire susceptibility prediction on the 500m × 500m canonical spatial grid without temporal leakage.
- **Deliverables**:
  - Standalone Risk Engine Service (`services/risk-engine/`) completely decoupled from FastAPI/PostGIS/Celery.
  - Strict Feature Contracts (`RiskFeatureSchema`, `FeatureSpec`, `RiskFeatureValidator`) enforcing physical bounds and rejecting non-finite anomalies across 20 numerical and 10 fuel categories.
  - Temporal Splitter (`TemporalSplitter`) guaranteeing strict chronological separation ($\max(T_{\text{train}}) \le \min(T_{\text{val}})$) with zero future data leakage.
  - Preprocessor (`FeaturePreprocessor`) with deterministic fuel one-hot matrix encoding and automatic cyclical/vector geometric feature derivation.
  - Machine Learning Trainers: Native XGBoost (`XGBoostRiskTrainer`) with dynamic `scale_pos_weight` rare-event imbalance scaling, plus comparative Random Forest baseline (`RandomForestRiskTrainer`).
  - Evaluation & Model Cards: Comprehensive metrics computation (`metrics.json`), human-readable Markdown evaluation report (`evaluation_report.md`), and complete production `MODEL_CARD.md`.
  - Model Registry & Safe Serialization (`ModelRegistry`, `ModelArtifactSerializer`) using native `model.json` (no insecure pickles) and versioned tracking under `models/risk/<version>/`.
  - High-Performance Inference (`ModelLoader`, `RiskPredictor`) supporting single-cell, batch, and vectorized DataFrame inference with standardized Pydantic contracts (`RiskPrediction`).
  - Unified CLI (`python -m services.risk_engine.cli` with `train`, `evaluate`, `predict`, `info` subcommands).
  - Test Suite: 30 new unit and integration tests across features, splits, trainers, evaluation, edge cases, and inference contracts (85/85 total monorepo tests passing).

---

### Phase 6: 24-Hour Risk Model -> FastAPI -> PostGIS -> GIS [COMPLETED]
- **Objectives**: Connect the Phase 5 trained 24-hour XGBoost fire risk model to the FastAPI backend, PostGIS spatial persistence layer, and the React GIS dashboard.
- **Deliverables**:
  - In-Memory Model Manager (`RiskModelManager`) loading and caching active model (`risk-xgboost-v001`) at startup with graceful fallback to `MODEL_UNAVAILABLE` status without crashing the API.
  - End-to-End Orchestrator (`RiskService`) integrating Phase 4 canonical features, Phase 5 XGBoost vector inference (`RiskPredictor`), PostGIS `risk_predictions` and `grid_cells` persistence, and GeoJSON conversion.
  - Thin REST Endpoints:
    - `GET /api/v1/risk/{region_id}` returning GeoJSON FeatureCollection of 500m cells with exact probability, risk class, 24h forecast window, model version, and environmental telemetry.
    - `GET /api/v1/risk/{region_id}/summary` providing real regional risk distributions (`low`, `moderate`, `high`, `extreme`) and mean probabilities.
    - `POST /api/v1/risk/predict` triggering synchronous on-demand batch inference with strict idempotency guards (`force_recompute`).
  - Spatial Persistence & Idempotency: `RiskRepository` supporting spatial joins with `grid_cells`, duplicate prevention on `(grid_cell_id, valid_for_date, model_version)`, and recompute overrides.
  - Enhanced GIS Frontend:
    - Real model layer rendered across 2,668 500m spatial cells with threshold styling.
    - Interactive 500m cell inspector rendering fire probability, risk class badge, FWI rating, elevation, slope, fuel classification, model version, forecast window, and generation timestamp.
    - Regional summary card powered by live `/summary` endpoint.
    - "Run Prediction" on-demand trigger button integrated directly into the map controls bar.
  - Automated Verification: 11 new integration tests in `test_risk_integration.py` (96/96 monorepo backend tests passing, 25/25 frontend tests passing, clean TypeScript build).

---

### Phase 7: 12-Hour Cellular Automata Spread Engine
- **Objectives**: Implement physical/heuristic Cellular Automata fire spread simulation engine incorporating wind vectors, slope, aspect, and fuel types.
- **Deliverables**:
  - 2D grid matrix state representation (`UNBURNED`, `BURNING`, `BURNED`).
  - Local propagation rules with wind vector amplification and uphill slope acceleration.
  - Indian vegetation fuel model parameter calibration.
  - Hourly timestep generator producing burned area (ha), velocity (km/h), and perimeter polygons.
  - Initial hooks for Rothermel surface fire equations.

---

### Phase 8: Asynchronous Simulation & Live GIS Visualization
- **Objectives**: Integrate the spread engine into Celery background workers and provide interactive animated playback on the GIS frontend.
- **Deliverables**:
  - Celery task execution for on-demand simulation requests.
  - Timestep persistence in PostGIS (`simulation_steps`).
  - Frontend interactive 12-hour timeline slider with play/pause/scrub controls.
  - Multi-temporal polygon perimeter rendering showing fire progression hour-by-hour.

---

### Phase 9: Dashboard, UX & Operational Command Features
- **Objectives**: Build comprehensive command dashboard analytics, reporting, and operational alert features.
- **Deliverables**:
  - Summary metric cards (total active fires, high-risk area in sq km, weather hazard indices).
  - Fire spread rate of change graphs and cumulative burned area curves.
  - PDF/GeoJSON export of risk forecasts and predicted perimeters for field responders.
  - Automated threshold alerts for extreme risk detections.

---

### Phase 10: Validation, Hardening & Production Deployment
- **Objectives**: Execute blind back-testing on recent fire events, perform load testing, security audits, and production containerization.
- **Deliverables**:
  - Blind back-testing on 2025-2026 fire events evaluating Intersection over Union (IoU) accuracy.
  - End-to-end integration and performance test suites.
  - Production Docker builds, Kubernetes manifests, and CI/CD pipelines.
  - Production security hardening, rate limiting, and complete technical handover documentation.
