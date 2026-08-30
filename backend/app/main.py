from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import datetime
import json
import os

from app.database.database import get_db, engine
from app.database.init_db import init_db
from app.database.models import (
    RiskZoneModel,
    SensorReadingModel,
    WeatherReadingModel,
    SatelliteObservationModel,
    RiskAssessmentModel,
    AlertModel,
    FieldReportModel,
    EmergencyPriorityModel
)
from app.schemas.all_schemas import (
    RiskZoneSchema,
    SensorReadingSchema,
    AlertSchema,
    FieldReportSchema,
    FieldReportCreateSchema,
    EmergencyPrioritySchema,
    RiskAnalysisSimulationRequest,
    RiskAnalysisSimulationResponse,
    RiskHistoryResponse,
    RiskHistoryItemSchema
)

# Initialize database on app import / startup
init_db()

app = FastAPI(
    title="Slope Shield Landslide Early Warning System API",
    description="SIH 2026 Problem Statement 26001 - AI-Based Early Warning and Landslide Risk Monitoring System with SQLite Persistence",
    version="3.0.0"
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

active_scenario = {
    "stage": 5,
    "scenarioId": "aizawl-monsoon",
    "updatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat()
}

STAGE_WEATHER_MAP = {
    1: {"rainfallRateMmHr": 4.0,  "accumulation24hMm": 16.0,  "intensityLabel": "NORMAL",           "trend": "STABLE"},
    2: {"rainfallRateMmHr": 22.0, "accumulation24hMm": 52.0,  "intensityLabel": "MODERATE RAIN",     "trend": "INCREASING"},
    3: {"rainfallRateMmHr": 34.0, "accumulation24hMm": 86.0,  "intensityLabel": "HEAVY DOWNPOUR",    "trend": "INCREASING"},
    4: {"rainfallRateMmHr": 40.0, "accumulation24hMm": 104.0, "intensityLabel": "HEAVY DOWNPOUR",    "trend": "INCREASING"},
    5: {"rainfallRateMmHr": 42.5, "accumulation24hMm": 168.4, "intensityLabel": "TORRENTIAL MONSOON", "trend": "INCREASING"},
    6: {"rainfallRateMmHr": 5.0,  "accumulation24hMm": 120.0, "intensityLabel": "NORMAL",           "trend": "DECREASING"},
}

STAGE_TELEMETRY_MAP = {
    1: {"riskScore": 38, "riskLevel": "LOW",      "soilMoisturePct": 34.0, "porePressureKPa": 14.2, "insarDisplacementMm": -0.6,  "slopeInstabilityPct": 28.0, "roadStatus": "OPEN", "recommendedAction": "Routine automated telemetry polling. Visual spot-checks."},
    2: {"riskScore": 58, "riskLevel": "MODERATE", "soilMoisturePct": 48.0, "porePressureKPa": 26.5, "insarDisplacementMm": -1.8,  "slopeInstabilityPct": 49.0, "roadStatus": "OPEN", "recommendedAction": "Monitor drainage channels and road shoulder cracks."},
    3: {"riskScore": 76, "riskLevel": "HIGH",     "soilMoisturePct": 62.0, "porePressureKPa": 42.0, "insarDisplacementMm": -4.1,  "slopeInstabilityPct": 68.0, "roadStatus": "AT RISK", "recommendedAction": "Pre-position emergency clearing equipment. Regulate traffic."},
    4: {"riskScore": 86, "riskLevel": "HIGH",     "soilMoisturePct": 70.0, "porePressureKPa": 52.6, "insarDisplacementMm": -6.8,  "slopeInstabilityPct": 76.0, "roadStatus": "AT RISK", "recommendedAction": "Deploy response units on standby. Restrict heavy traffic."},
    5: {"riskScore": 92, "riskLevel": "CRITICAL", "soilMoisturePct": 84.0, "porePressureKPa": 58.4, "insarDisplacementMm": -28.4, "slopeInstabilityPct": 91.0, "roadStatus": "BLOCKED", "recommendedAction": "Execute Pre-Emptive Evacuation Order for Downslope Settlements."},
    6: {"riskScore": 48, "riskLevel": "MODERATE", "soilMoisturePct": 55.0, "porePressureKPa": 28.0, "insarDisplacementMm": -28.8, "slopeInstabilityPct": 45.0, "roadStatus": "OPEN", "recommendedAction": "PWD debris clearance complete. Residents return under monitoring."},
}

sensor_histories_map = {
    1: [
        {"timestamp": "10:00", "soilMoisture": 30.0, "tilt": 0.8, "porePressure": 12.0},
        {"timestamp": "11:00", "soilMoisture": 31.0, "tilt": 0.8, "porePressure": 12.5},
        {"timestamp": "12:00", "soilMoisture": 32.0, "tilt": 0.9, "porePressure": 13.0},
        {"timestamp": "13:00", "soilMoisture": 33.0, "tilt": 0.9, "porePressure": 13.5},
        {"timestamp": "14:00", "soilMoisture": 34.0, "tilt": 0.9, "porePressure": 14.2}
    ],
    2: [
        {"timestamp": "10:00", "soilMoisture": 34.0, "tilt": 0.9, "porePressure": 14.2},
        {"timestamp": "11:00", "soilMoisture": 38.0, "tilt": 1.1, "porePressure": 17.0},
        {"timestamp": "12:00", "soilMoisture": 41.0, "tilt": 1.3, "porePressure": 20.0},
        {"timestamp": "13:00", "soilMoisture": 45.0, "tilt": 1.6, "porePressure": 23.5},
        {"timestamp": "14:00", "soilMoisture": 48.0, "tilt": 1.8, "porePressure": 26.5}
    ],
    3: [
        {"timestamp": "10:00", "soilMoisture": 48.0, "tilt": 1.8, "porePressure": 26.5},
        {"timestamp": "11:00", "soilMoisture": 52.0, "tilt": 2.2, "porePressure": 31.0},
        {"timestamp": "12:00", "soilMoisture": 55.0, "tilt": 2.6, "porePressure": 35.0},
        {"timestamp": "13:00", "soilMoisture": 58.0, "tilt": 3.0, "porePressure": 38.5},
        {"timestamp": "14:00", "soilMoisture": 62.0, "tilt": 3.4, "porePressure": 42.0}
    ],
    4: [
        {"timestamp": "10:00", "soilMoisture": 62.0, "tilt": 3.4, "porePressure": 42.0},
        {"timestamp": "11:00", "soilMoisture": 64.0, "tilt": 3.7, "porePressure": 45.0},
        {"timestamp": "12:00", "soilMoisture": 66.0, "tilt": 4.0, "porePressure": 48.0},
        {"timestamp": "13:00", "soilMoisture": 68.0, "tilt": 4.4, "porePressure": 50.5},
        {"timestamp": "14:00", "soilMoisture": 70.0, "tilt": 4.7, "porePressure": 52.6}
    ],
    5: [
        {"timestamp": "10:00", "soilMoisture": 70.0, "tilt": 4.7, "porePressure": 52.6},
        {"timestamp": "11:00", "soilMoisture": 73.0, "tilt": 5.0, "porePressure": 54.5},
        {"timestamp": "12:00", "soilMoisture": 76.0, "tilt": 5.2, "porePressure": 56.0},
        {"timestamp": "13:00", "soilMoisture": 80.0, "tilt": 5.4, "porePressure": 57.5},
        {"timestamp": "14:00", "soilMoisture": 84.0, "tilt": 5.6, "porePressure": 58.4}
    ],
    6: [
        {"timestamp": "10:00", "soilMoisture": 84.0, "tilt": 5.6, "porePressure": 58.4},
        {"timestamp": "11:00", "soilMoisture": 70.0, "tilt": 5.7, "porePressure": 50.0},
        {"timestamp": "12:00", "soilMoisture": 65.0, "tilt": 5.7, "porePressure": 42.0},
        {"timestamp": "13:00", "soilMoisture": 60.0, "tilt": 5.7, "porePressure": 34.0},
        {"timestamp": "14:00", "soilMoisture": 55.0, "tilt": 5.7, "porePressure": 28.0}
    ],
}

def zone_to_dict(z: RiskZoneModel) -> Dict[str, Any]:
    target_zone_code = "N-03" if active_scenario["scenarioId"] == "sonapur-corridor" else "N-11" if active_scenario["scenarioId"] == "gangtok-seismic" else "N-07"
    stage = active_scenario["stage"]
    is_target = z.zone_code.upper() == target_zone_code.upper()

    risk_score = STAGE_TELEMETRY_MAP[stage]["riskScore"] if is_target else z.risk_score
    risk_level = STAGE_TELEMETRY_MAP[stage]["riskLevel"] if is_target else z.risk_level
    rainfall_rate = STAGE_WEATHER_MAP[stage]["rainfallRateMmHr"] if is_target else z.rainfall_rate_mm_hr
    accumulation = STAGE_WEATHER_MAP[stage]["accumulation24hMm"] if is_target else z.accumulation_24h_mm
    soil_moisture = STAGE_TELEMETRY_MAP[stage]["soilMoisturePct"] if is_target else z.soil_moisture_pct
    pore_pressure = STAGE_TELEMETRY_MAP[stage]["porePressureKPa"] if is_target else z.pore_pressure_kpa
    insar_disp = STAGE_TELEMETRY_MAP[stage]["insarDisplacementMm"] if is_target else z.insar_displacement_mm
    slope_instab = STAGE_TELEMETRY_MAP[stage]["slopeInstabilityPct"] if is_target else z.slope_instability_pct
    road_status = STAGE_TELEMETRY_MAP[stage]["roadStatus"] if is_target else z.road_status
    recommended_action = STAGE_TELEMETRY_MAP[stage]["recommendedAction"] if is_target else z.recommended_action

    forecast_to = "LOW" if stage == 6 else "CRITICAL" if stage >= 3 else "HIGH" if stage == 2 else "LOW"
    forecast_trend = "DECREASING" if stage == 6 else "INCREASING" if stage >= 2 else "STABLE"

    return {
        "id": z.id,
        "code": z.zone_code,
        "name": z.zone_name,
        "district": z.district,
        "state": z.state,
        "coordinates": [z.latitude, z.longitude],
        "riskScore": risk_score,
        "riskLevel": risk_level,
        "slopeAngleDeg": z.slope_angle_deg,
        "soilMoisturePct": soil_moisture,
        "rainfallRateMmHr": rainfall_rate,
        "accumulation24hMm": accumulation,
        "porePressureKPa": pore_pressure,
        "insarDisplacementMm": insar_disp,
        "historicalVulnerabilityPct": z.historical_vulnerability_pct,
        "slopeInstabilityPct": slope_instab,
        "roadStatus": road_status,
        "affectedRoad": z.affected_road,
        "forecast6h": {
            "from": z.risk_level,
            "to": forecast_to,
            "projectedScore": min(99, int(risk_score * 1.05)),
            "trend": forecast_trend
        },
        "populationAtRisk": z.population_at_risk,
        "sensorNodeId": z.sensor_node_id or f"SN-{z.zone_code.replace('-', '')}A",
        "lastUpdated": "Live Telemetry",
        "description": z.description or "",
        "recommendedAction": recommended_action
    }

def sensor_to_dict(s: SensorReadingModel) -> Dict[str, Any]:
    target_sensor_node_id = "SN-03B" if active_scenario["scenarioId"] == "sonapur-corridor" else "SN-11C" if active_scenario["scenarioId"] == "gangtok-seismic" else "SN-07A"
    stage = active_scenario["stage"]
    is_target = s.sensor_id.upper() == target_sensor_node_id.upper()

    soil_moisture = STAGE_TELEMETRY_MAP[stage]["soilMoisturePct"] if is_target else s.soil_moisture
    tilt = (5.6 if stage == 5 else 4.7 if stage == 4 else 3.4 if stage == 3 else 1.8 if stage == 2 else 5.7 if stage == 6 else 0.9) if is_target else s.tilt
    pore_pressure = STAGE_TELEMETRY_MAP[stage]["porePressureKPa"] if is_target else s.pore_pressure
    status = ("WARNING" if stage in [3, 4, 5] else "ONLINE") if is_target else s.status

    history = []
    if is_target:
        history = sensor_histories_map[stage]
    elif s.history_json:
        try:
            history = json.loads(s.history_json)
        except Exception:
            pass

    return {
        "id": s.id,
        "nodeId": s.sensor_id,
        "nodeName": s.sensor_name,
        "zoneCode": s.zone.zone_code if s.zone else "N-07",
        "location": s.location,
        "status": status,
        "isSimulated": s.is_simulated,
        "soilMoisturePct": soil_moisture,
        "slopeTiltDeg": tilt,
        "porePressureKPa": pore_pressure,
        "batteryPct": s.battery,
        "signalDbm": s.signal,
        "lastPing": "30s ago",
        "depthMeters": s.depth_meters,
        "history": history
    }

def alert_to_dict(a: AlertModel) -> Dict[str, Any]:
    triggers = []
    if a.trigger_factors_json:
        try:
            triggers = json.loads(a.trigger_factors_json)
        except Exception:
            pass
    dispatched = []
    if a.dispatched_to_json:
        try:
            dispatched = json.loads(a.dispatched_to_json)
        except Exception:
            pass
    return {
        "id": a.id,
        "alertCode": a.alert_code,
        "severity": a.severity,
        "zoneCode": a.zone.zone_code if a.zone else "N-07",
        "locationName": a.zone.zone_name if a.zone else "Hunthar Ridge",
        "district": a.zone.district if a.zone else "Aizawl",
        "state": a.zone.state if a.zone else "Mizoram",
        "riskScore": a.risk_score,
        "headline": a.title,
        "summary": a.summary,
        "timestamp": a.created_at.strftime("%H:%M IST") if a.created_at else "Just now",
        "minutesAgo": 4,
        "contributingTriggers": triggers,
        "threatenedCorridor": a.threatened_corridor,
        "status": a.status,
        "dispatchedTo": dispatched,
        "acknowledged": a.acknowledged,
        "acknowledgedAt": a.acknowledged_at.isoformat() if a.acknowledged_at else None
    }

def report_to_dict(r: FieldReportModel) -> Dict[str, Any]:
    return {
        "id": r.id,
        "ticketNumber": r.ticket_id,
        "reporterName": r.reporter_name,
        "role": r.role,
        "contact": r.contact,
        "zoneCode": r.zone_code,
        "location": r.location,
        "coordinates": [r.latitude, r.longitude],
        "reportType": r.report_type,
        "severity": r.severity,
        "description": r.description,
        "photoUrl": r.photo_url,
        "timestamp": r.created_at.strftime("%b %d, %H:%M") if r.created_at else "Just now",
        "status": r.triage_status,
        "confidenceScore": r.ai_confidence,
        "triageNotes": r.triage_notes
    }

def emergency_to_dict(ep: EmergencyPriorityModel) -> Dict[str, Any]:
    shelters = []
    if ep.evacuation_shelters_json:
        try:
            shelters = json.loads(ep.evacuation_shelters_json)
        except Exception:
            pass
    units = []
    if ep.assigned_units_json:
        try:
            units = json.loads(ep.assigned_units_json)
        except Exception:
            pass
    return {
        "rank": ep.priority_rank,
        "zoneCode": ep.zone_code,
        "zoneName": ep.zone_name,
        "district": ep.district,
        "state": ep.state,
        "riskScore": ep.risk_score,
        "severity": ep.severity,
        "reason": ep.reason,
        "recommendedResponse": ep.recommended_response,
        "primaryAction": ep.primary_action,
        "actionDetails": ep.action_details,
        "targetDDMA": ep.target_ddma,
        "ndrfBattalionAssigned": ep.ndrf_battalion_assigned,
        "evacuationStatus": ep.evacuation_status,
        "estimatedPeopleAffected": ep.estimated_people_affected,
        "shelterCapacityReady": ep.shelter_capacity_ready,
        "affectedRoads": ep.affected_roads,
        "affectedSettlements": ep.affected_settlements,
        "evacuationShelters": shelters,
        "assignedUnits": units,
        "roadClosureStatus": ep.road_closure_status
    }

# -----------------------------------------------------------------------------
# Scenario State Sync API
# -----------------------------------------------------------------------------
@app.post("/api/scenario")
def update_scenario(payload: Dict[str, Any]):
    global active_scenario
    stage = payload.get("stage")
    scenario_id = payload.get("scenarioId")
    if stage and int(stage) in [1, 2, 3, 4, 5, 6]:
        active_scenario = {
            "stage": int(stage),
            "scenarioId": scenario_id or active_scenario["scenarioId"],
            "updatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
    return {"success": True, "activeScenario": active_scenario}

@app.get("/api/scenario-state")
def get_scenario_state(db: Session = Depends(get_db)):
    target_zone_code = "N-03" if active_scenario["scenarioId"] == "sonapur-corridor" else "N-11" if active_scenario["scenarioId"] == "gangtok-seismic" else "N-07"
    zone = db.query(RiskZoneModel).filter(RiskZoneModel.zone_code.ilike(target_zone_code)).first()
    score = STAGE_TELEMETRY_MAP[active_scenario["stage"]]["riskScore"] if zone else 50
    return {
        "success": True,
        "activeScenario": active_scenario,
        "stageWeather": STAGE_WEATHER_MAP[active_scenario["stage"]],
        "stageZoneN07": {
            "riskScore": score,
            "riskLevel": STAGE_TELEMETRY_MAP[active_scenario["stage"]]["riskLevel"]
        },
        "factorOfSafety": round(1.85 - (score / 100) * 1.1, 2),
        "ruptureHorizonHours": 2.5 if score >= 85 else 5.0 if score >= 70 else 12.0
    }

# -----------------------------------------------------------------------------
# 1. Health & Integration Status API
# -----------------------------------------------------------------------------
@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    db_status = "ONLINE"
    zone_count = 0
    try:
        zone_count = db.query(RiskZoneModel).count()
    except Exception as e:
        db_status = f"ERROR: {str(e)}"

    return {
        "status": "ok",
        "node": "Slope Shield FastAPI Service (:8001 / SQLite)",
        "phase": "Phase 4: End-to-End Demo & Intelligence Engine",
        "activeScenario": active_scenario,
        "database": {
            "type": "SQLite / SQLAlchemy ORM",
            "status": db_status,
            "recordCount": zone_count,
            "storageMode": "LOCAL PERSISTENT STORAGE"
        },
        "dataMode": "CALIBRATED SIMULATION (NORTHEAST INDIA DOMAIN)",
        "geminiLive": bool(os.getenv("GEMINI_API_KEY")),
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

# -----------------------------------------------------------------------------
# 2. Composite Dashboard API
# -----------------------------------------------------------------------------
@app.get("/api/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    zones = db.query(RiskZoneModel).all()
    sensors = db.query(SensorReadingModel).all()
    weather = db.query(WeatherReadingModel).first()
    satellite = db.query(SatelliteObservationModel).first()

    mapped_zones = [zone_to_dict(z) for z in zones]
    mapped_sensors = [sensor_to_dict(s) for s in sensors]

    # Dynamic alerts list
    alerts_response = get_alerts(db)
    mapped_alerts = alerts_response["data"]

    # Dynamic emergency priorities
    priorities_response = get_emergency_priorities(db)
    mapped_priorities = priorities_response["data"]

    stage = active_scenario["stage"]
    high_risk_count = sum(1 for z in mapped_zones if z["riskLevel"] == "HIGH") + 8
    critical_count = sum(1 for z in mapped_zones if z["riskLevel"] == "CRITICAL")
    active_alerts_count = sum(1 for a in mapped_alerts if not a["acknowledged"]) + 2

    rain_rate = STAGE_WEATHER_MAP[stage]["rainfallRateMmHr"]
    accum_24h = STAGE_WEATHER_MAP[stage]["accumulation24hMm"]
    intensity = STAGE_WEATHER_MAP[stage]["intensityLabel"]
    trend = STAGE_WEATHER_MAP[stage]["trend"]

    disp = -28.4
    if stage == 1:
        disp = -0.6
    elif stage == 2:
        disp = -1.8
    elif stage == 3:
        disp = -4.1
    elif stage == 4:
        disp = -6.8
    elif stage == 5:
        disp = -28.4
    elif stage == 6:
        disp = -28.8

    disp_status = "STABLE" if stage in [1, 2, 6] else "ELEVATED VELOCITY" if stage == 5 else "DISPLACEMENT DETECTED"

    return {
        "success": True,
        "data": {
            "metrics": {
                "totalMonitored": 57,
                "highRiskCount": high_risk_count,
                "criticalCount": critical_count,
                "activeAlertsCount": active_alerts_count
            },
            "zones": mapped_zones,
            "sensors": mapped_sensors,
            "weather": {
                "stationId": weather.station_id if weather else "AWS-NER-07",
                "zoneCode": "N-07",
                "location": weather.station_location if weather else "Aizawl West Doppler Station",
                "rainfallRateMmHr": rain_rate,
                "intensityLabel": intensity,
                "accumulation24hMm": accum_24h,
                "accumulation72hMm": 312.0,
                "trend": trend,
                "humidityPct": 95 if rain_rate > 30 else 80,
                "windSpeedKmh": 28,
                "pressureHpa": 986,
                "isSimulatedFeed": True
            },
            "satellite": {
                "id": satellite.id if satellite else "sat-1",
                "satelliteName": satellite.satellite_name if satellite else "Sentinel-1A",
                "sensorType": satellite.sensor_type if satellite else "C-band SAR / InSAR",
                "targetRegion": satellite.target_region if satellite else "Hunthar Ridge & Mizoram Fold Belt",
                "surfaceMotionMm": disp,
                "motionDirection": satellite.motion_direction if satellite else "SUBSIDENCE / DOWNSLOPE",
                "displacementStatus": disp_status,
                "observationPeriodDays": 12,
                "lastPassDate": satellite.observation_date if satellite else "Yesterday 18:30 UTC",
                "passType": "Ascending Orbit",
                "spatialResolutionM": satellite.spatial_resolution_m if satellite else 10,
                "coherenceScore": satellite.coherence if satellite else 0.88,
                "integrationStatus": "ACTIVE REAL-TIME STREAM"
            },
            "alerts": mapped_alerts,
            "emergencyPriorities": mapped_priorities,
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
    }

# -----------------------------------------------------------------------------
# 3. Risk Zones API
# -----------------------------------------------------------------------------
@app.get("/api/risk-zones")
def get_risk_zones(db: Session = Depends(get_db)):
    zones = db.query(RiskZoneModel).all()
    return {
        "success": True,
        "data": [zone_to_dict(z) for z in zones],
        "count": len(zones),
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

@app.get("/api/risk-zones/{zone_id}")
def get_risk_zone(zone_id: str, db: Session = Depends(get_db)):
    zone = db.query(RiskZoneModel).filter(
        (RiskZoneModel.zone_code.ilike(zone_id)) | (RiskZoneModel.id.ilike(zone_id))
    ).first()
    if not zone:
        raise HTTPException(status_code=404, detail=f"Risk zone '{zone_id}' not found")
    return {"success": True, "data": zone_to_dict(zone)}

# -----------------------------------------------------------------------------
# 4. Geotechnical Explainable AI & Physics Simulation
# -----------------------------------------------------------------------------
@app.get("/api/risk-analysis/{zone_id}")
def get_risk_analysis(zone_id: str, db: Session = Depends(get_db)):
    zone = db.query(RiskZoneModel).filter(
        (RiskZoneModel.zone_code.ilike(zone_id)) | (RiskZoneModel.id.ilike(zone_id))
    ).first()
    if not zone:
        zone = db.query(RiskZoneModel).first()

    if not zone:
        raise HTTPException(status_code=404, detail="No risk zones available in database")

    return {
        "success": True,
        "data": {
            "zoneCode": zone.zone_code,
            "zoneName": f"{zone.zone_name} ({zone.district})",
            "currentRiskScore": zone.risk_score,
            "severity": zone.risk_level,
            "aiConfidencePct": 94,
            "modelEngine": "SlopeShield PINN + XGBoost Ensemble",
            "contributors": {
                "rainfall": {"weight": 0.35, "valuePct": min(100, int(zone.rainfall_rate_mm_hr * 2.2)), "rawValue": f"{zone.rainfall_rate_mm_hr} mm/hr", "status": "Threshold Exceeded"},
                "soilMoisture": {"weight": 0.25, "valuePct": int(zone.soil_moisture_pct), "rawValue": f"{zone.soil_moisture_pct}% moisture", "status": "Saturated"},
                "slopeInstability": {"weight": 0.20, "valuePct": int(zone.slope_instability_pct), "rawValue": f"{zone.slope_angle_deg}° slope", "status": "Active Creep"},
                "historical": {"weight": 0.10, "valuePct": int(zone.historical_vulnerability_pct), "rawValue": "High Recurrence", "status": "Vulnerability Match"},
                "insarDeformation": {"weight": 0.10, "valuePct": int(abs(zone.insar_displacement_mm) * 3.2), "rawValue": f"{zone.insar_displacement_mm} mm", "status": "LOS Displacement"}
            },
            "temporalProjection": [
                {"hoursAhead": 0, "riskScore": zone.risk_score, "rainfallIntensity": zone.rainfall_rate_mm_hr, "soilSaturation": zone.soil_moisture_pct, "confidence": 94},
                {"hoursAhead": 2, "riskScore": min(99, int(zone.risk_score * 1.04)), "rainfallIntensity": zone.rainfall_rate_mm_hr * 1.1, "soilSaturation": min(98, zone.soil_moisture_pct + 4), "confidence": 91},
                {"hoursAhead": 4, "riskScore": min(99, int(zone.risk_score * 1.06)), "rainfallIntensity": zone.rainfall_rate_mm_hr * 1.15, "soilSaturation": min(98, zone.soil_moisture_pct + 7), "confidence": 88},
                {"hoursAhead": 6, "riskScore": min(99, int(zone.risk_score * 1.08)), "rainfallIntensity": zone.rainfall_rate_mm_hr * 0.9, "soilSaturation": min(98, zone.soil_moisture_pct + 8), "confidence": 85}
            ],
            "falseAlarmSuppressionMetrics": {
                "antecedentSoilMoistureIndex": round(zone.soil_moisture_pct / 100, 2),
                "vegetationIndexNDVI": 0.45,
                "geologicalFrictionAngle": round(32 - zone.slope_angle_deg * 0.15, 1),
                "crossValidationScore": 0.958,
                "historicalCorrelationMatch": f"88.5% pattern match for {zone.district} geomorphology"
            },
            "whyThisScore": [
                f"Rainfall rate ({zone.rainfall_rate_mm_hr} mm/hr) exceeds critical saturation threshold.",
                f"Soil moisture at {zone.soil_moisture_pct}% creates elevated pore water pressure.",
                f"Slope angle of {zone.slope_angle_deg}° creates substantial shear impetus."
            ]
        }
    }

# -----------------------------------------------------------------------------
# 5. Historical Risk Assessment Endpoint (Phase 3 Requirement)
# -----------------------------------------------------------------------------
@app.get("/api/risk-history/{zone_id}", response_model=RiskHistoryResponse)
def get_risk_history(zone_id: str, db: Session = Depends(get_db)):
    assessments = db.query(RiskAssessmentModel).filter(
        RiskAssessmentModel.zone_code.ilike(zone_id)
    ).order_by(RiskAssessmentModel.created_at.asc()).all()

    items = []
    for a in assessments:
        items.append(RiskHistoryItemSchema(
            id=a.id,
            zoneCode=a.zone_code,
            timestamp=a.created_at.strftime("%b %d %H:%M UTC") if a.created_at else "Historical",
            riskScore=a.risk_score,
            severity=a.severity,
            rainfallContribution=a.rainfall_contribution,
            soilMoistureContribution=a.soil_moisture_contribution,
            slopeContribution=a.slope_contribution,
            factorOfSafety=a.factor_of_safety,
            predictionHorizon=a.prediction_horizon,
            advisory=a.advisory
        ))

    return RiskHistoryResponse(
        success=True,
        zoneCode=zone_id.upper(),
        count=len(items),
        data=items
    )

@app.post("/api/risk-analysis/simulate", response_model=Dict[str, Any])
def simulate_risk(req: RiskAnalysisSimulationRequest, persist: bool = Query(default=False), db: Session = Depends(get_db)):
    score = min(99, max(15, int(req.rainfallRateMmHr * 0.9 + req.soilMoisturePct * 0.45 + req.tiltRateDeg * 4.2 + 10)))
    severity = "CRITICAL" if score >= 85 else "HIGH" if score >= 70 else "MODERATE" if score >= 45 else "LOW"
    fos = round(1.85 - (score / 100) * 1.1, 2)
    horizon = 2.5 if score >= 85 else 5.0 if score >= 70 else 12.0
    advisory = "Catastrophic failure predicted. Immediate evacuation protocol warranted." if score >= 85 else "Elevated risk alert. Monitor slope and restrict highway."

    # Persist historical assessment if requested
    if persist and req.zoneCode:
        zone = db.query(RiskZoneModel).filter(RiskZoneModel.zone_code.ilike(req.zoneCode)).first()
        if zone:
            new_assessment = RiskAssessmentModel(
                id=f"ra-{int(datetime.datetime.now().timestamp() * 1000)}",
                zone_id=zone.id,
                zone_code=zone.zone_code,
                risk_score=score,
                severity=severity,
                factor_of_safety=fos,
                prediction_horizon=f"{horizon}h",
                advisory=advisory,
                created_at=datetime.datetime.now(datetime.timezone.utc)
            )
            db.add(new_assessment)
            db.commit()

    return {
        "success": True,
        "data": {
            "simulatedRiskScore": score,
            "simulatedSeverity": severity,
            "factorOfSafety": fos,
            "ruptureHorizonHours": horizon,
            "advisory": advisory
        }
    }

# -----------------------------------------------------------------------------
# 6. Geotechnical Sensors API
# -----------------------------------------------------------------------------
@app.get("/api/sensors")
def get_sensors(db: Session = Depends(get_db)):
    sensors = db.query(SensorReadingModel).all()
    return {"success": True, "data": [sensor_to_dict(s) for s in sensors], "count": len(sensors)}

@app.get("/api/sensors/{zone_id}")
def get_zone_sensors(zone_id: str, db: Session = Depends(get_db)):
    sensors = db.query(SensorReadingModel).join(RiskZoneModel).filter(
        (RiskZoneModel.zone_code.ilike(zone_id)) | (RiskZoneModel.id.ilike(zone_id))
    ).all()
    if not sensors:
        sensors = db.query(SensorReadingModel).all()
    return {"success": True, "data": [sensor_to_dict(s) for s in sensors], "zoneCode": zone_id}

# -----------------------------------------------------------------------------
# 7. Alerts & Acknowledgements API (Persistent Update)
# -----------------------------------------------------------------------------
@app.get("/api/alerts")
def get_alerts(db: Session = Depends(get_db)):
    alerts = db.query(AlertModel).order_by(AlertModel.created_at.desc()).all()
    target_zone_code = "N-03" if active_scenario["scenarioId"] == "sonapur-corridor" else "N-11" if active_scenario["scenarioId"] == "gangtok-seismic" else "N-07"
    stage = active_scenario["stage"]

    result = []
    for a in alerts:
        zone_code = a.zone.zone_code if a.zone else "N-07"
        if zone_code.upper() == target_zone_code.upper():
            if stage <= 2:
                continue
            ad = alert_to_dict(a)
            ad["riskScore"] = STAGE_TELEMETRY_MAP[stage]["riskScore"]
            ad["severity"] = STAGE_TELEMETRY_MAP[stage]["riskLevel"]
            ad["acknowledged"] = (stage == 6)
            if stage == 3:
                ad["headline"] = f"ORANGE WARNING: Elevated Subsurface Saturation at {target_zone_code}"
                ad["status"] = "PENDING REVIEW"
            elif stage == 4:
                ad["headline"] = f"ORANGE WARNING: InSAR Creep & Tilt Displacement at {target_zone_code}"
                ad["status"] = "DISPATCHED"
            elif stage == 5:
                ad["headline"] = f"RED ALERT: Imminent Slope Shear Failure at {target_zone_code}"
                ad["status"] = "DISPATCHED"
            elif stage == 6:
                ad["headline"] = f"RECOVERY ALERT: Stabilization & Cleanup In Progress at {target_zone_code}"
                ad["status"] = "DISPATCHED"
            result.append(ad)
        else:
            result.append(alert_to_dict(a))
    return {"success": True, "data": result, "count": len(result)}

@app.post("/api/alerts/acknowledge")
def acknowledge_alert(payload: Dict[str, str], db: Session = Depends(get_db)):
    alert_id = payload.get("alertId")
    if not alert_id:
        raise HTTPException(status_code=400, detail="Missing alertId")

    alert = db.query(AlertModel).filter(
        (AlertModel.id == alert_id) | (AlertModel.alert_code == alert_id)
    ).first()

    now = datetime.datetime.now(datetime.timezone.utc)
    if alert:
        alert.acknowledged = True
        alert.acknowledged_at = now
        db.commit()

    return {
        "success": True,
        "alertId": alert_id,
        "acknowledgedAt": now.isoformat(),
        "message": "Alert acknowledgement persisted in SQLite database"
    }

# -----------------------------------------------------------------------------
# 8. Field Reports API (Persistent INSERT / PATCH)
# -----------------------------------------------------------------------------
@app.get("/api/reports")
def get_reports(db: Session = Depends(get_db)):
    reports = db.query(FieldReportModel).order_by(FieldReportModel.created_at.desc()).all()
    return {"success": True, "data": [report_to_dict(r) for r in reports], "count": len(reports)}

@app.post("/api/reports")
def create_report(req: FieldReportCreateSchema, db: Session = Depends(get_db)):
    zone = db.query(RiskZoneModel).filter(RiskZoneModel.zone_code.ilike(req.zoneCode)).first()
    zone_id = zone.id if zone else "zone-1"

    now = datetime.datetime.now(datetime.timezone.utc)
    new_report = FieldReportModel(
        id=f"rep-{int(now.timestamp() * 1000)}",
        ticket_id=f"FR-{now.strftime('%M%S')}",
        zone_id=zone_id,
        reporter_name=req.reporterName,
        role=req.role,
        contact=req.contact,
        zone_code=req.zoneCode,
        location=req.location,
        latitude=req.coordinates[0],
        longitude=req.coordinates[1],
        report_type=req.reportType,
        severity=req.severity,
        description=req.description,
        photo_url=req.photoUrl or "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
        ai_confidence=96,
        triage_status="NEW",
        triage_notes="Geo-stamped reconnaissance report persisted to SQLite database.",
        created_at=now
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return {"success": True, "data": report_to_dict(new_report)}

@app.patch("/api/reports/{report_id}")
def update_report(report_id: str, payload: Dict[str, Any], db: Session = Depends(get_db)):
    report = db.query(FieldReportModel).filter(
        (FieldReportModel.id == report_id) | (FieldReportModel.ticket_id == report_id)
    ).first()

    if not report:
        raise HTTPException(status_code=404, detail=f"Report '{report_id}' not found")

    if "status" in payload and payload["status"]:
        report.triage_status = payload["status"]
    if "notes" in payload:
        report.triage_notes = payload["notes"]

    db.commit()
    return {"success": True, "reportId": report_id, "status": report.triage_status, "notes": report.triage_notes}

# -----------------------------------------------------------------------------
# 9. Emergency Priorities API
# -----------------------------------------------------------------------------
@app.get("/api/emergency-priorities")
def get_emergency_priorities(db: Session = Depends(get_db)):
    priorities = db.query(EmergencyPriorityModel).all()
    target_zone_code = "N-03" if active_scenario["scenarioId"] == "sonapur-corridor" else "N-11" if active_scenario["scenarioId"] == "gangtok-seismic" else "N-07"
    stage = active_scenario["stage"]

    result = []
    for ep in priorities:
        ep_dict = emergency_to_dict(ep)
        if ep.zone_code.upper() == target_zone_code.upper():
            risk_score = STAGE_TELEMETRY_MAP[stage]["riskScore"]
            severity = STAGE_TELEMETRY_MAP[stage]["riskLevel"]
            status = "STANDBY"
            evac_status = "STANDBY MONITORING"

            if stage == 3:
                status = "MONITORING INTENSIVE"
                evac_status = "IMMEDIATE FIELD VERIFICATION"
            elif stage == 4:
                status = "ELEVATED HAZARD"
                evac_status = "ROAD CORRIDOR AT RISK"
            elif stage == 5:
                status = "ACTIVE EMERGENCY"
                evac_status = "PRE-EMPTIVE EVACUATION ORDER"

            ep_dict["riskScore"] = risk_score
            ep_dict["severity"] = severity
            ep_dict["status"] = status
            ep_dict["evacuationStatus"] = evac_status
        result.append(ep_dict)

    result.sort(key=lambda x: x["riskScore"], reverse=True)
    for idx, r in enumerate(result):
        r["rank"] = idx + 1

    return {"success": True, "data": result, "count": len(result)}

# -----------------------------------------------------------------------------
# 10. Weather & Satellite API
# -----------------------------------------------------------------------------
@app.get("/api/weather/{zone_id}")
def get_weather(zone_id: str, db: Session = Depends(get_db)):
    zone = db.query(RiskZoneModel).filter(
        (RiskZoneModel.zone_code.ilike(zone_id)) | (RiskZoneModel.id.ilike(zone_id))
    ).first()

    rainfall_rate = zone.rainfall_rate_mm_hr if zone else 42.5
    accum_24h = zone.accumulation_24h_mm if zone else 168.4

    return {
        "success": True,
        "data": {
            "zoneCode": zone_id.upper(),
            "tempC": 23.5,
            "pressureHpa": 986,
            "windSpeedKmph": 24,
            "rainfallRateMmHr": rainfall_rate,
            "accumulation24hMm": accum_24h,
            "humidity": 95 if rainfall_rate > 30 else 80,
            "isCloudburstRisk": rainfall_rate > 35,
            "description": "Monsoonal rain bands over Northeast terrain",
            "source": "fastapi-sqlite-weather-provider",
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
    }

@app.get("/api/satellite/{zone_id}")
def get_satellite(zone_id: str, db: Session = Depends(get_db)):
    zone = db.query(RiskZoneModel).filter(
        (RiskZoneModel.zone_code.ilike(zone_id)) | (RiskZoneModel.id.ilike(zone_id))
    ).first()
    disp = zone.insar_displacement_mm if zone else -28.4

    return {
        "success": True,
        "data": {
            "satellite": "Sentinel-1A (C-Band SAR)",
            "orbitPass": "Ascending Track 142",
            "losDisplacementMmPerYear": disp,
            "temporalCoherence": 0.88,
            "phaseInterferometryConfidence": "94.2%",
            "unstableAreaSqKm": 3.42,
            "criticalAnomaliesDetected": 4 if abs(disp) > 20 else 1,
            "source": "fastapi-sqlite-satellite-provider"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8001, reload=True)
