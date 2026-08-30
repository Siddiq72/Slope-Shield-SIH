import json
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.database.database import engine, Base, SessionLocal
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

def init_db():
    # 1. Create all tables if not exist
    Base.metadata.create_all(bind=engine)
    
    # 2. Seed calibrated domain records if database is empty
    db: Session = SessionLocal()
    try:
        existing_zones = db.query(RiskZoneModel).count()
        if existing_zones == 0:
            print("[SlopeShield DB] Initializing SQLite database with calibrated Northeast India risk data...")
            seed_data(db)
        else:
            print(f"[SlopeShield DB] SQLite database already populated with {existing_zones} risk zones. Skipping seed.")
    finally:
        db.close()

def seed_data(db: Session):
    now = datetime.now(timezone.utc)

    # 1. Risk Zones
    z1 = RiskZoneModel(
        id="zone-1",
        zone_code="N-07",
        zone_name="Hunthar Escarpment Corridor",
        district="Aizawl",
        state="Mizoram",
        latitude=23.7307,
        longitude=92.7173,
        risk_score=92,
        risk_level="CRITICAL",
        slope_angle_deg=48.0,
        soil_moisture_pct=84.0,
        rainfall_rate_mm_hr=42.5,
        accumulation_24h_mm=168.4,
        pore_pressure_kpa=58.4,
        insar_displacement_mm=-28.4,
        historical_vulnerability_pct=88.0,
        slope_instability_pct=91.0,
        road_status="BLOCKED",
        affected_road="NH-54 (Aizawl - Silchar National Highway)",
        population_at_risk=14200,
        sensor_node_id="SN-07A",
        description="Active bedding slip along fractured Disang shale. Hydrostatic pore water saturation triggering acute creep.",
        recommended_action="Execute Pre-Emptive Evacuation Order for Downslope Settlements.",
        updated_at=now
    )

    z2 = RiskZoneModel(
        id="zone-2",
        zone_code="N-03",
        zone_name="Sonapur Tunnel Approach Slopes",
        district="East Jaintia Hills",
        state="Meghalaya",
        latitude=25.1322,
        longitude=92.3584,
        risk_score=84,
        risk_level="HIGH",
        slope_angle_deg=42.0,
        soil_moisture_pct=76.0,
        rainfall_rate_mm_hr=34.0,
        accumulation_24h_mm=142.0,
        pore_pressure_kpa=46.2,
        insar_displacement_mm=-21.8,
        historical_vulnerability_pct=82.0,
        slope_instability_pct=79.0,
        road_status="AT RISK",
        affected_road="NH-06 (Shillong - Silchar Lifeline Highway)",
        population_at_risk=8600,
        sensor_node_id="SN-03B",
        description="Heavy limestone-sandstone overburden saturated by monsoonal downpours.",
        recommended_action="Deploy SDRF quick response unit to NH-06 kilometer marker 142.",
        updated_at=now
    )

    z3 = RiskZoneModel(
        id="zone-3",
        zone_code="N-11",
        zone_name="9th Mile - Ranipool Highway Ridge",
        district="Gangtok",
        state="Sikkim",
        latitude=27.3389,
        longitude=88.6065,
        risk_score=78,
        risk_level="HIGH",
        slope_angle_deg=45.0,
        soil_moisture_pct=69.0,
        rainfall_rate_mm_hr=28.5,
        accumulation_24h_mm=118.0,
        pore_pressure_kpa=38.5,
        insar_displacement_mm=-14.2,
        historical_vulnerability_pct=79.0,
        slope_instability_pct=74.0,
        road_status="AT RISK",
        affected_road="NH-10 (Siliguri - Gangtok Arterial Link)",
        population_at_risk=6400,
        sensor_node_id="SN-11C",
        description="Tension fissures expanding along the upper colluvium boundary. Teesta river scouring slope toe.",
        recommended_action="One-way controlled transit on NH-10. Station Border Roads Organisation patrol.",
        updated_at=now
    )

    z4 = RiskZoneModel(
        id="zone-4",
        zone_code="N-14",
        zone_name="Kohima Bypass Overhang",
        district="Kohima",
        state="Nagaland",
        latitude=25.6751,
        longitude=94.1086,
        risk_score=68,
        risk_level="MODERATE",
        slope_angle_deg=38.0,
        soil_moisture_pct=58.0,
        rainfall_rate_mm_hr=22.0,
        accumulation_24h_mm=85.0,
        pore_pressure_kpa=28.0,
        insar_displacement_mm=-9.5,
        historical_vulnerability_pct=65.0,
        slope_instability_pct=62.0,
        road_status="OPEN",
        affected_road="NH-29 (Dimapur - Kohima Highway)",
        population_at_risk=4200,
        sensor_node_id="SN-14A",
        description="Continuous moderate rainfall with nominal basal creep within tolerance threshold.",
        recommended_action="Routine automated telemetry polling. Visual spot-checks.",
        updated_at=now
    )

    db.add_all([z1, z2, z3, z4])
    db.flush()

    # 2. Sensors (Simulated Telemetry)
    sens1_history = [
        {"timestamp": "10:00", "soilMoisture": 42, "tilt": 1.2, "porePressure": 18.2},
        {"timestamp": "11:00", "soilMoisture": 54, "tilt": 2.1, "porePressure": 28.4},
        {"timestamp": "12:00", "soilMoisture": 68, "tilt": 3.4, "porePressure": 41.0},
        {"timestamp": "13:00", "soilMoisture": 79, "tilt": 4.8, "porePressure": 52.1},
        {"timestamp": "14:00", "soilMoisture": 84, "tilt": 5.6, "porePressure": 58.4}
    ]
    s1 = SensorReadingModel(
        id="sens-1",
        zone_id=z1.id,
        sensor_id="SN-07A",
        sensor_name="Hunthar Deep Piezometer Probe A",
        sensor_type="Multi-Depth Piezometer & MEMS Inclinometer",
        location="Hunthar Ridge Km 4.2, Aizawl",
        status="WARNING",
        is_simulated=True,
        soil_moisture=84.0,
        tilt=5.6,
        pore_pressure=58.4,
        battery=92,
        signal=-68,
        depth_meters=8.5,
        history_json=json.dumps(sens1_history),
        timestamp=now
    )

    sens2_history = [
        {"timestamp": "10:00", "soilMoisture": 38, "tilt": 0.9, "porePressure": 14.1},
        {"timestamp": "11:00", "soilMoisture": 48, "tilt": 1.6, "porePressure": 22.0},
        {"timestamp": "12:00", "soilMoisture": 61, "tilt": 2.8, "porePressure": 33.5},
        {"timestamp": "13:00", "soilMoisture": 71, "tilt": 3.6, "porePressure": 41.2},
        {"timestamp": "14:00", "soilMoisture": 76, "tilt": 4.2, "porePressure": 46.2}
    ]
    s2 = SensorReadingModel(
        id="sens-2",
        zone_id=z2.id,
        sensor_id="SN-03B",
        sensor_name="Sonapur Inclinometer Array B",
        sensor_type="Subsurface Inclinometer & Moisture Probe",
        location="East Jaintia Hills, NH-06",
        status="WARNING",
        is_simulated=True,
        soil_moisture=76.0,
        tilt=4.2,
        pore_pressure=46.2,
        battery=88,
        signal=-74,
        depth_meters=6.0,
        history_json=json.dumps(sens2_history),
        timestamp=now
    )

    db.add_all([s1, s2])

    # 3. Weather Readings
    w1 = WeatherReadingModel(
        id="w-1",
        zone_id=z1.id,
        station_id="AWS-NER-07",
        station_location="Aizawl West Doppler Station",
        rainfall_rate=42.5,
        rainfall_24h=168.4,
        rainfall_72h=312.0,
        intensity_label="TORRENTIAL MONSOON",
        temperature=23.5,
        humidity=95,
        wind_speed=28.0,
        pressure_hpa=986.0,
        forecast_trend="INCREASING",
        is_simulated=True,
        timestamp=now
    )
    db.add(w1)

    # 4. Satellite Observations
    sat1 = SatelliteObservationModel(
        id="sat-1",
        zone_id=z1.id,
        satellite_name="Sentinel-1A",
        sensor_type="C-band SAR / InSAR",
        target_region="Hunthar Ridge & Mizoram Fold Belt",
        displacement=-28.4,
        motion_direction="SUBSIDENCE / DOWNSLOPE",
        coherence=0.88,
        spatial_resolution_m=10,
        observation_date="Yesterday 18:30 UTC",
        source="ESA Copernicus Open Access (Calibrated InSAR Simulation)",
        status="DISPLACEMENT DETECTED",
        created_at=now
    )
    db.add(sat1)

    # 5. Historical Risk Assessments (Chronological progression)
    h1 = RiskAssessmentModel(
        id="ra-1",
        zone_id=z1.id,
        zone_code="N-07",
        risk_score=42,
        severity="LOW",
        rainfall_contribution=0.20,
        soil_moisture_contribution=0.20,
        slope_contribution=0.30,
        factor_of_safety=1.85,
        prediction_horizon="6h",
        advisory="Normal antecedent baseline.",
        created_at=now - timedelta(hours=16)
    )
    h2 = RiskAssessmentModel(
        id="ra-2",
        zone_id=z1.id,
        zone_code="N-07",
        risk_score=63,
        severity="MODERATE",
        rainfall_contribution=0.30,
        soil_moisture_contribution=0.25,
        slope_contribution=0.25,
        factor_of_safety=1.45,
        prediction_horizon="6h",
        advisory="Monsoon surge initiates moisture infiltration.",
        created_at=now - timedelta(hours=10)
    )
    h3 = RiskAssessmentModel(
        id="ra-3",
        zone_id=z1.id,
        zone_code="N-07",
        risk_score=78,
        severity="HIGH",
        rainfall_contribution=0.35,
        soil_moisture_contribution=0.30,
        slope_contribution=0.20,
        factor_of_safety=1.15,
        prediction_horizon="6h",
        advisory="Accelerated creep and pore pressure spike.",
        created_at=now - timedelta(hours=4)
    )
    h4 = RiskAssessmentModel(
        id="ra-4",
        zone_id=z1.id,
        zone_code="N-07",
        risk_score=92,
        severity="CRITICAL",
        rainfall_contribution=0.35,
        soil_moisture_contribution=0.25,
        slope_contribution=0.20,
        factor_of_safety=0.76,
        prediction_horizon="6h",
        advisory="Active shear bedding plane failure. Immediate evacuation protocol warranted.",
        created_at=now
    )
    db.add_all([h1, h2, h3, h4])

    # 6. Alerts
    triggers_1 = [
        "Precipitation > 42.5 mm/hr (Cloudburst)",
        "Volumetric Soil Saturation = 84%",
        "Tilt Rate Acceleration > 4.5°/hr",
        "InSAR LOS Displacement = -28.4 mm"
    ]
    dispatched_1 = [
        "SDMA Mizoram",
        "DDMA Aizawl",
        "1st Battalion NDRF Guwahati",
        "SDRF Mizoram"
    ]
    alt1 = AlertModel(
        id="alt-1",
        zone_id=z1.id,
        alert_code="ALT-2026-N07",
        severity="CRITICAL",
        risk_score=92,
        title="RED ALERT: Imminent Slope Shear Failure at Hunthar Escarpment (NH-54)",
        summary="Composite AI risk index reached 92%. In-situ piezometers report hydrostatic pore water pressure of 58.4 kPa with rapid angular tilt acceleration (5.6°).",
        trigger_factors_json=json.dumps(triggers_1),
        threatened_corridor="NH-54 & Downslope Settled Hamlet (14,200 Residents)",
        dispatched_to_json=json.dumps(dispatched_1),
        status="DISPATCHED",
        acknowledged=False,
        created_at=now - timedelta(minutes=4)
    )
    db.add(alt1)

    # 7. Field Reports
    rep1 = FieldReportModel(
        id="rep-1",
        ticket_id="FR-8821",
        zone_id=z1.id,
        reporter_name="Lalremruata Pachuau",
        role="Field Recon Officer",
        contact="+91 94361-XXXXX",
        zone_code="N-07",
        location="Hunthar Veng Lower Step Section",
        latitude=23.7315,
        longitude=92.7165,
        report_type="Ground Crack",
        severity="CRITICAL",
        description="Observed active 8cm widening tension crack propagating along retaining wall.",
        photo_url="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
        ai_confidence=98,
        triage_status="VERIFIED",
        triage_notes="Corroborated with Sensor SN-07A sudden tilt surge (+1.4°/hr).",
        created_at=now - timedelta(minutes=12)
    )
    db.add(rep1)

    # 8. Emergency Priorities
    shelters_1 = [
        "Aizawl West Higher Secondary Hall (Capacity: 650)",
        "Government Central High School Edenthar (Capacity: 450)"
    ]
    units_1 = [
        "1st Battalion NDRF Quick Response Team Alpha",
        "SDRF Mizoram Rescue Detachment 3"
    ]
    ep1 = EmergencyPriorityModel(
        id="ep-1",
        zone_id=z1.id,
        zone_code="N-07",
        zone_name="Hunthar Ridge",
        district="Aizawl",
        state="Mizoram",
        priority_rank=1,
        risk_score=92,
        severity="CRITICAL",
        reason="Active shear bedding plane failure triggered by continuous monsoonal downpour (42.5 mm/hr) and 84% volumetric soil saturation.",
        recommended_response="Issue immediate Red Alert pre-emptive evacuation order for downstream residential clusters.",
        primary_action="Immediate Pre-Emptive Evacuation Directive",
        action_details="Issue Red Alert evacuation for 14,200 residents in Hunthar downslope runout fan.",
        target_ddma="DDMA Aizawl & SDMA Mizoram",
        ndrf_battalion_assigned="1st Bn NDRF Detachment",
        evacuation_status="PRE-EMPTIVE EVACUATION ORDER",
        estimated_people_affected=14200,
        shelter_capacity_ready=True,
        affected_roads="NH-54 (Aizawl - Silchar National Highway)",
        affected_settlements="Hunthar Veng, Edenthar Sector",
        evacuation_shelters_json=json.dumps(shelters_1),
        assigned_units_json=json.dumps(units_1),
        road_closure_status="NH-54 Closed to civilian traffic at Km 4.2.",
        created_at=now
    )
    db.add(ep1)

    db.commit()
    print("[SlopeShield DB] Seeding completed successfully.")
