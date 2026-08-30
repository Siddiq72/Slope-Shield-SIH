from sqlalchemy import Column, String, Integer, Float, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database.database import Base

class RiskZoneModel(Base):
    __tablename__ = "risk_zones"

    id = Column(String(50), primary_key=True, index=True)
    zone_code = Column(String(20), unique=True, index=True, nullable=False)
    zone_name = Column(String(100), nullable=False)
    district = Column(String(50), nullable=False)
    state = Column(String(50), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    risk_score = Column(Integer, nullable=False, default=50)
    risk_level = Column(String(20), nullable=False, default="MODERATE") # LOW, MODERATE, HIGH, CRITICAL
    slope_angle_deg = Column(Float, nullable=False, default=40.0)
    soil_moisture_pct = Column(Float, nullable=False, default=50.0)
    rainfall_rate_mm_hr = Column(Float, nullable=False, default=10.0)
    accumulation_24h_mm = Column(Float, nullable=False, default=30.0)
    pore_pressure_kpa = Column(Float, nullable=False, default=25.0)
    insar_displacement_mm = Column(Float, nullable=False, default=0.0)
    historical_vulnerability_pct = Column(Float, nullable=False, default=70.0)
    slope_instability_pct = Column(Float, nullable=False, default=60.0)
    road_status = Column(String(20), nullable=False, default="OPEN") # OPEN, AT RISK, BLOCKED
    affected_road = Column(String(150), nullable=True)
    population_at_risk = Column(Integer, nullable=False, default=1000)
    sensor_node_id = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    recommended_action = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    sensors = relationship("SensorReadingModel", back_populates="zone", cascade="all, delete-orphan")
    weather_readings = relationship("WeatherReadingModel", back_populates="zone", cascade="all, delete-orphan")
    satellite_observations = relationship("SatelliteObservationModel", back_populates="zone", cascade="all, delete-orphan")
    risk_assessments = relationship("RiskAssessmentModel", back_populates="zone", cascade="all, delete-orphan")
    alerts = relationship("AlertModel", back_populates="zone", cascade="all, delete-orphan")
    field_reports = relationship("FieldReportModel", back_populates="zone", cascade="all, delete-orphan")
    emergency_priorities = relationship("EmergencyPriorityModel", back_populates="zone", cascade="all, delete-orphan")


class SensorReadingModel(Base):
    __tablename__ = "sensor_readings"

    id = Column(String(50), primary_key=True, index=True)
    zone_id = Column(String(50), ForeignKey("risk_zones.id"), nullable=False, index=True)
    sensor_id = Column(String(50), unique=True, index=True, nullable=False) # e.g. SN-07A
    sensor_name = Column(String(100), nullable=False)
    sensor_type = Column(String(50), default="Deep Piezometer & Tilt Inclinometer")
    location = Column(String(100), nullable=False)
    status = Column(String(20), default="ONLINE") # ONLINE, WARNING, OFFLINE, CALIBRATING
    is_simulated = Column(Boolean, default=True) # Explicitly notes simulated telemetry status
    soil_moisture = Column(Float, nullable=False, default=50.0)
    tilt = Column(Float, nullable=False, default=1.0)
    pore_pressure = Column(Float, nullable=False, default=20.0)
    battery = Column(Integer, default=90)
    signal = Column(Integer, default=-70)
    depth_meters = Column(Float, default=6.0)
    history_json = Column(Text, nullable=True) # Serialized 5-step time series
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    zone = relationship("RiskZoneModel", back_populates="sensors")


class WeatherReadingModel(Base):
    __tablename__ = "weather_readings"

    id = Column(String(50), primary_key=True, index=True)
    zone_id = Column(String(50), ForeignKey("risk_zones.id"), nullable=False, index=True)
    station_id = Column(String(50), default="AWS-NER-07")
    station_location = Column(String(100), default="Doppler Weather Radar Station")
    rainfall_rate = Column(Float, nullable=False, default=0.0)
    rainfall_24h = Column(Float, nullable=False, default=0.0)
    rainfall_72h = Column(Float, nullable=False, default=0.0)
    intensity_label = Column(String(50), default="MODERATE RAIN")
    temperature = Column(Float, default=24.0)
    humidity = Column(Integer, default=85)
    wind_speed = Column(Float, default=18.0)
    pressure_hpa = Column(Float, default=992.0)
    forecast_trend = Column(String(20), default="STABLE") # INCREASING, STABLE, DECREASING
    is_simulated = Column(Boolean, default=True) # Explicitly denotes simulated weather feed
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    zone = relationship("RiskZoneModel", back_populates="weather_readings")


class SatelliteObservationModel(Base):
    __tablename__ = "satellite_observations"

    id = Column(String(50), primary_key=True, index=True)
    zone_id = Column(String(50), ForeignKey("risk_zones.id"), nullable=False, index=True)
    satellite_name = Column(String(50), default="Sentinel-1A")
    sensor_type = Column(String(50), default="C-band SAR / InSAR")
    target_region = Column(String(100), default="Northeast India Fold Belt")
    displacement = Column(Float, nullable=False, default=-15.0) # Line of sight displacement mm
    motion_direction = Column(String(50), default="SUBSIDENCE / DOWNSLOPE")
    coherence = Column(Float, default=0.88)
    spatial_resolution_m = Column(Integer, default=10)
    observation_date = Column(String(50), default="Yesterday 18:30 UTC")
    source = Column(String(100), default="ESA Copernicus Open Access (Calibrated Simulation)")
    status = Column(String(50), default="DISPLACEMENT DETECTED") # INTEGRATION READY
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    zone = relationship("RiskZoneModel", back_populates="satellite_observations")


class RiskAssessmentModel(Base):
    __tablename__ = "risk_assessments"

    id = Column(String(50), primary_key=True, index=True)
    zone_id = Column(String(50), ForeignKey("risk_zones.id"), nullable=False, index=True)
    zone_code = Column(String(20), nullable=False, index=True)
    risk_score = Column(Integer, nullable=False)
    severity = Column(String(20), nullable=False) # LOW, MODERATE, HIGH, CRITICAL
    rainfall_contribution = Column(Float, default=0.35)
    soil_moisture_contribution = Column(Float, default=0.25)
    slope_contribution = Column(Float, default=0.20)
    historical_contribution = Column(Float, default=0.10)
    insar_contribution = Column(Float, default=0.10)
    factor_of_safety = Column(Float, default=1.20)
    prediction_horizon = Column(String(20), default="6h")
    advisory = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    zone = relationship("RiskZoneModel", back_populates="risk_assessments")


class AlertModel(Base):
    __tablename__ = "alerts"

    id = Column(String(50), primary_key=True, index=True)
    zone_id = Column(String(50), ForeignKey("risk_zones.id"), nullable=False, index=True)
    alert_code = Column(String(50), unique=True, index=True, nullable=False)
    severity = Column(String(20), nullable=False, default="HIGH") # LOW, MODERATE, HIGH, CRITICAL
    risk_score = Column(Integer, nullable=False, default=80)
    title = Column(String(200), nullable=False) # headline
    summary = Column(Text, nullable=False) # message
    trigger_factors_json = Column(Text, nullable=True) # serialized list of triggers
    threatened_corridor = Column(String(150), nullable=True)
    dispatched_to_json = Column(Text, nullable=True) # serialized list of departments
    status = Column(String(30), default="DISPATCHED") # DISPATCHED, PENDING REVIEW, ESCALATED
    acknowledged = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    acknowledged_at = Column(DateTime, nullable=True)

    zone = relationship("RiskZoneModel", back_populates="alerts")


class FieldReportModel(Base):
    __tablename__ = "field_reports"

    id = Column(String(50), primary_key=True, index=True)
    ticket_id = Column(String(50), unique=True, index=True, nullable=False) # e.g. FR-8821
    zone_id = Column(String(50), ForeignKey("risk_zones.id"), nullable=False, index=True)
    reporter_name = Column(String(100), nullable=False)
    role = Column(String(50), nullable=False) # Field Recon Officer, Community Volunteer, PWD Engineer, Disaster Warden
    contact = Column(String(50), nullable=False)
    zone_code = Column(String(20), nullable=False)
    location = Column(String(150), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    report_type = Column(String(50), nullable=False) # Ground Crack, Rockfall / Debris, Culvert Overflow, Subsidence, Mudflow, Toe Erosion
    severity = Column(String(20), nullable=False, default="HIGH")
    description = Column(Text, nullable=False)
    photo_url = Column(Text, nullable=True)
    ai_confidence = Column(Integer, default=95)
    triage_status = Column(String(30), default="NEW") # NEW, UNDER REVIEW, VERIFIED, RESOLVED
    triage_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    zone = relationship("RiskZoneModel", back_populates="field_reports")


class EmergencyPriorityModel(Base):
    __tablename__ = "emergency_priorities"

    id = Column(String(50), primary_key=True, index=True)
    zone_id = Column(String(50), ForeignKey("risk_zones.id"), nullable=False, index=True)
    zone_code = Column(String(20), nullable=False)
    zone_name = Column(String(100), nullable=False)
    district = Column(String(50), nullable=False)
    state = Column(String(50), nullable=False)
    priority_rank = Column(Integer, nullable=False, default=1)
    risk_score = Column(Integer, nullable=False)
    severity = Column(String(20), nullable=False, default="CRITICAL")
    reason = Column(Text, nullable=True)
    recommended_response = Column(Text, nullable=True)
    primary_action = Column(String(150), nullable=False)
    action_details = Column(Text, nullable=True)
    target_ddma = Column(String(100), nullable=False)
    ndrf_battalion_assigned = Column(String(100), nullable=False)
    evacuation_status = Column(String(100), default="PRE-EMPTIVE EVACUATION ORDER")
    estimated_people_affected = Column(Integer, default=0)
    shelter_capacity_ready = Column(Boolean, default=True)
    affected_roads = Column(String(150), nullable=True)
    affected_settlements = Column(String(150), nullable=True)
    evacuation_shelters_json = Column(Text, nullable=True) # Serialized list
    assigned_units_json = Column(Text, nullable=True) # Serialized list
    road_closure_status = Column(String(150), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    zone = relationship("RiskZoneModel", back_populates="emergency_priorities")
