# Slope Shield — FastAPI Backend Service (Phase 2)
**SIH 2026 Problem Statement 26001: AI-Based Early Warning and Landslide Risk Monitoring System in NER**

## Architecture Overview
The backend service provides high-performance, asynchronous REST APIs for:
- Geotechnical sensor telemetry ingestion and real-time threshold monitoring
- Multi-source landslide risk fusion (XGBoost + Physics-Informed Geomechanical Network / PINN)
- Common Alerting Protocol (CAP) and SMS emergency broadcast dispatching
- Crowdsourced field reconnaissance report triage
- Priority NDRF/SDRF disaster management response registry

## Prerequisites & Installation
```bash
cd backend
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Running the FastAPI Server
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```
Swagger UI Documentation: `http://127.0.0.1:8001/docs`  
ReDoc Documentation: `http://127.0.0.1:8001/redoc`

## Key REST API Endpoints
- `GET  /api/health` — System health & node operational telemetry
- `GET  /api/dashboard` — Composite aggregated dashboard payload
- `GET  /api/risk-zones` — Full list of monitored landslide risk zones in Northeast India
- `GET  /api/risk-zones/{zone_id}` — Granular geotechnical profile for a zone
- `GET  /api/risk-analysis/{zone_id}` — Explainable AI (SHAP weights, PINN physics, temporal trajectory)
- `POST /api/risk-analysis/simulate` — Parametric what-if scenario calculator
- `GET  /api/sensors` — In-situ geotechnical sensors (piezometers, inclinometers, pore pressure)
- `GET  /api/alerts` — Active early warning alerts and sirens
- `POST /api/alerts/acknowledge` — Emergency incident acknowledgement
- `GET  /api/reports` — Field reconnaissance reports
- `POST /api/reports` — Submit new 1-Tap geostamped field report
- `GET  /api/emergency-priorities` — Priority response matrix for DDMA/NDRF
- `GET  /api/weather/{zone_id}` — Weather Doppler radar and rainfall rate
- `GET  /api/satellite/{zone_id}` — Sentinel-1 C-band InSAR surface displacement
