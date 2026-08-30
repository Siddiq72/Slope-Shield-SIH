export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface RiskZone {
  id: string;
  code: string; // e.g. "N-07"
  name: string; // "Hunthar Ridge"
  district: string; // "Aizawl"
  state: string; // "Mizoram"
  coordinates: [number, number]; // [lat, lng]
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  slopeAngleDeg: number;
  soilMoisturePct: number;
  rainfallRateMmHr: number;
  accumulation24hMm: number;
  porePressureKPa: number;
  insarDisplacementMm: number;
  historicalVulnerabilityPct: number;
  slopeInstabilityPct: number;
  roadStatus: 'OPEN' | 'AT RISK' | 'BLOCKED';
  affectedRoad?: string;
  forecast6h: {
    from: RiskLevel;
    to: RiskLevel;
    projectedScore: number;
    trend: 'INCREASING' | 'STABLE' | 'DECREASING';
  };
  populationAtRisk: number;
  sensorNodeId: string;
  lastUpdated: string;
  description: string;
  recommendedAction: string;
}

export interface SensorReading {
  id: string;
  nodeId: string; // "SN-07A"
  nodeName: string;
  zoneCode: string;
  location: string;
  status: 'ONLINE' | 'WARNING' | 'OFFLINE' | 'CALIBRATING';
  isSimulated: boolean;
  soilMoisturePct: number;
  slopeTiltDeg: number;
  porePressureKPa: number;
  batteryPct: number;
  signalDbm: number;
  lastPing: string;
  depthMeters: number;
  history: Array<{
    timestamp: string;
    soilMoisture: number;
    tilt: number;
    porePressure: number;
  }>;
}

export interface WeatherReading {
  stationId: string;
  zoneCode: string;
  location: string;
  rainfallRateMmHr: number;
  intensityLabel: 'NORMAL' | 'MODERATE RAIN' | 'HEAVY DOWNPOUR' | 'TORRENTIAL MONSOON';
  accumulation24hMm: number;
  accumulation72hMm: number;
  trend: 'INCREASING' | 'STABLE' | 'DECREASING';
  humidityPct: number;
  windSpeedKmh: number;
  pressureHpa: number;
  isSimulatedFeed: boolean;
  hourlyForecast: Array<{
    time: string;
    rate: number;
    probability: number;
  }>;
}

export interface SatelliteObservation {
  id: string;
  satelliteName: string; // "Sentinel-1" | "NISAR"
  sensorType: string; // "C-band SAR / InSAR"
  targetRegion: string;
  surfaceMotionMm: number;
  motionDirection: 'SUBSIDENCE / DOWNSLOPE' | 'UPLIFT / STABLE';
  displacementStatus: 'DISPLACEMENT DETECTED' | 'STABLE' | 'ELEVATED VELOCITY';
  observationPeriodDays: number;
  lastPassDate: string;
  passType: 'Ascending Orbit' | 'Descending Orbit';
  spatialResolutionM: number;
  coherenceScore: number;
  integrationStatus: 'INTEGRATION READY' | 'ACTIVE REAL-TIME STREAM';
}

export interface RoadSegment {
  id: string;
  highwayCode: string; // "NH-44", "NH-10"
  name: string; // "Shillong - Silchar Corridor"
  region: string;
  status: 'OPEN' | 'AT RISK' | 'BLOCKED';
  connectedZones: string[];
  trafficVolumeDaily: number;
  criticalSection: string;
  alternativeRoute?: string;
  currentAdvisory: string;
}

export interface Alert {
  id: string;
  alertCode: string; // "ALT-2026-N07"
  severity: RiskLevel;
  zoneCode: string;
  locationName: string;
  district: string;
  state: string;
  riskScore: number;
  headline: string;
  summary: string;
  timestamp: string;
  minutesAgo: number;
  contributingTriggers: string[];
  threatenedCorridor?: string;
  status: 'DISPATCHED' | 'PENDING REVIEW' | 'ESCALATED';
  dispatchedTo: string[];
  acknowledged: boolean;
}

export interface FieldReport {
  id: string;
  ticketNumber: string; // "FR-8821"
  reporterName: string;
  role: 'Field Recon Officer' | 'Community Volunteer' | 'PWD Engineer' | 'Disaster Warden';
  contact: string;
  zoneCode: string;
  location: string;
  coordinates: [number, number];
  reportType: 'Ground Crack' | 'Rockfall / Debris' | 'Culvert Overflow' | 'Subsidence' | 'Mudflow' | 'Toe Erosion';
  severity: RiskLevel;
  description: string;
  photoUrl?: string;
  timestamp: string;
  status: 'NEW' | 'UNDER REVIEW' | 'VERIFIED' | 'RESOLVED';
  confidenceScore: number;
  triageNotes?: string;
}

export interface EmergencyPriority {
  rank: number;
  zoneCode: string;
  zoneName: string;
  district: string;
  state?: string;
  riskScore: number;
  severity: RiskLevel;
  reason?: string;
  recommendedResponse?: string;
  contributingFactors?: string[];
  affectedRoads?: string;
  affectedSettlements?: string;
  status?: string;
  primaryAction: string;
  actionDetails: string;
  targetDDMA: string; // "DDMA Aizawl", "DDMA East Sikkim"
  ndrfBattalionAssigned: string;
  evacuationStatus: 'IMMEDIATE FIELD VERIFICATION' | 'ROAD CORRIDOR AT RISK' | 'PRE-EMPTIVE EVACUATION ORDER' | 'STANDBY MONITORING';
  estimatedPeopleAffected: number;
  shelterCapacityReady: boolean;
  evacuationShelters?: string[];
  assignedUnits?: string[];
  roadClosureStatus?: string;
}

export interface RiskAnalysisExplainability {
  zoneCode: string;
  zoneName: string;
  currentRiskScore: number;
  severity: RiskLevel;
  aiConfidencePct: number;
  modelEngine: string; // "XGBoost-Ensemble + Physics-Informed Geomechanical Network"
  contributors: {
    rainfall: { weight: number; valuePct: number; rawValue: string; status: string };
    soilMoisture: { weight: number; valuePct: number; rawValue: string; status: string };
    slopeInstability: { weight: number; valuePct: number; rawValue: string; status: string };
    historical: { weight: number; valuePct: number; rawValue: string; status: string };
    insarDeformation: { weight: number; valuePct: number; rawValue: string; status: string };
  };
  temporalProjection: Array<{
    hoursAhead: number;
    riskScore: number;
    rainfallIntensity: number;
    soilSaturation: number;
    confidence: number;
  }>;
  falseAlarmSuppressionMetrics: {
    antecedentSoilMoistureIndex: number;
    vegetationIndexNDVI: number;
    geologicalFrictionAngle: number;
    crossValidationScore: number;
    historicalCorrelationMatch: string;
  };
  whyThisScore: string[];
}

export type NavigationTab = 
  | 'dashboard'
  | 'risk-map'
  | 'risk-analysis'
  | 'sensors'
  | 'reports'
  | 'alerts'
  | 'emergency'
  | 'settings';
