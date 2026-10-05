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

### Phase 5: 24-Hour Fire Risk Machine Learning Model
- **Objectives**: Develop, train, evaluate, and serialize baseline tabular/pixel-wise machine learning models for 24-hour fire susceptibility prediction.
- **Deliverables**:
  - Historical training dataset compilation (2015-2025 burn scars across Western Ghats and Himalayas).
  - Class imbalance handling (SMOTE / focal loss).
  - Random Forest and XGBoost classifier pipelines.
  - Evaluation reporting: Precision, Recall, F1-score, and ROC-AUC metrics.
  - Model registry, versioning, and artifact serialization.

---

### Phase 6: Risk Model Integration (Model -> Backend -> GIS)
- **Objectives**: Connect the trained 24-hour risk engine to the backend API and render spatial susceptibility layers on the GIS dashboard.
- **Deliverables**:
  - Celery scheduled task for automated daily risk scoring.
  - `/api/v1/risk/{region_id}` returning GeoJSON FeatureCollection of 500m cells.
  - Dynamic risk choropleth layer on frontend (Low: Green, Moderate: Yellow, High: Orange, Extreme: Red).
  - Cell click inspection displaying environmental precursors and risk probability.

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
