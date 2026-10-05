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

### Phase 3: Frontend & GIS Foundation
- **Objectives**: Build high-performance interactive GIS client using React, Leaflet/Mapbox GL JS, and Tailwind CSS.
- **Deliverables**:
  - Interactive map container supporting vector tile layers, raster overlays, and GeoJSON boundaries.
  - Region selection and viewport navigation.
  - Map controls: zoom, layer toggles, legend display, coordinate inspector.
  - Active fire hotspot marker rendering with popup telemetry (FRP, brightness temperature).
  - Responsive layout for operational command centers.

---

### Phase 4: Data Ingestion & Preprocessing Pipeline
- **Objectives**: Implement automated adapters for satellite, meteorological, vegetation, and terrain datasets, normalizing all inputs to a 500m × 500m common spatial grid.
- **Deliverables**:
  - Adapters: NASA/FIRMS (MODIS, VIIRS), IMD/ERA5 weather feeds, Sentinel-2/Landsat vegetation, CartoDEM/SRTM elevation.
  - Spatial resampler to 500m × 500m grid using Rasterio/GDAL.
  - Daily temporal compositing and missing data imputation (including Sentinel-1 SAR handling).
  - Feature engineering: NDVI, NDWI, slope, aspect, and Fire Weather Index (FWI) components.

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
