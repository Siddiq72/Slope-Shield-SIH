from typing import List, Optional, Literal, Dict, Any, Tuple
from pydantic import BaseModel, Field

RiskLevel = Literal['LOW', 'MODERATE', 'HIGH', 'CRITICAL']

class Forecast6h(BaseModel):
    from_level: RiskLevel = Field(alias="from")
    to: RiskLevel
    projectedScore: int
    trend: Literal['INCREASING', 'STABLE', 'DECREASING']

    class Config:
        populate_by_name = True

class RiskZoneSchema(BaseModel):
    id: str
    code: str
    name: str
    district: str
    state: str
    coordinates: Tuple[float, float]
    riskScore: int
    riskLevel: RiskLevel
    slopeAngleDeg: float
    soilMoisturePct: float
    rainfallRateMmHr: float
    accumulation24hMm: float
    porePressureKPa: float
    insarDisplacementMm: float
    historicalVulnerabilityPct: float
    slopeInstabilityPct: float
    roadStatus: Literal['OPEN', 'AT RISK', 'BLOCKED']
    affectedRoad: Optional[str] = None
    forecast6h: Dict[str, Any]
    populationAtRisk: int
    sensorNodeId: str
    lastUpdated: str
    description: str
    recommendedAction: str

class SensorHistoryItem(BaseModel):
    timestamp: str
    soilMoisture: float
    tilt: float
    porePressure: float

class SensorReadingSchema(BaseModel):
    id: str
    nodeId: str
    nodeName: str
    zoneCode: str
    location: str
    status: Literal['ONLINE', 'WARNING', 'OFFLINE', 'CALIBRATING']
    isSimulated: bool = True
    soilMoisturePct: float
    slopeTiltDeg: float
    porePressureKPa: float
    batteryPct: int
    signalDbm: int
    lastPing: str
    depthMeters: float
    history: List[SensorHistoryItem]

class AlertSchema(BaseModel):
    id: str
    alertCode: str
    severity: RiskLevel
    zoneCode: str
    locationName: str
    district: str
    state: str
    riskScore: int
    headline: str
    summary: str
    timestamp: str
    minutesAgo: int
    contributingTriggers: List[str]
    threatenedCorridor: Optional[str] = None
    status: Literal['DISPATCHED', 'PENDING REVIEW', 'ESCALATED']
    dispatchedTo: List[str]
    acknowledged: bool

class FieldReportCreateSchema(BaseModel):
    reporterName: str
    role: Literal['Field Recon Officer', 'Community Volunteer', 'PWD Engineer', 'Disaster Warden']
    contact: str
    zoneCode: str
    location: str
    coordinates: Tuple[float, float]
    reportType: Literal['Ground Crack', 'Rockfall / Debris', 'Culvert Overflow', 'Subsidence', 'Mudflow', 'Toe Erosion']
    severity: RiskLevel
    description: str
    photoUrl: Optional[str] = None

class FieldReportSchema(FieldReportCreateSchema):
    id: str
    ticketNumber: str
    timestamp: str
    status: Literal['NEW', 'UNDER REVIEW', 'VERIFIED', 'RESOLVED']
    confidenceScore: int
    triageNotes: Optional[str] = None

class EmergencyPrioritySchema(BaseModel):
    rank: int
    zoneCode: str
    zoneName: str
    district: str
    state: Optional[str] = None
    riskScore: int
    severity: RiskLevel
    reason: Optional[str] = None
    recommendedResponse: Optional[str] = None
    contributingFactors: Optional[List[str]] = None
    affectedRoads: Optional[str] = None
    affectedSettlements: Optional[str] = None
    status: Optional[str] = None
    primaryAction: str
    actionDetails: str
    targetDDMA: str
    ndrfBattalionAssigned: str
    evacuationStatus: str
    estimatedPeopleAffected: int
    shelterCapacityReady: bool
    evacuationShelters: Optional[List[str]] = None
    assignedUnits: Optional[List[str]] = None
    roadClosureStatus: Optional[str] = None

class RiskAnalysisSimulationRequest(BaseModel):
    zoneCode: Optional[str] = "N-07"
    rainfallRateMmHr: float = 40.0
    soilMoisturePct: float = 80.0
    tiltRateDeg: float = 4.5

class RiskAnalysisSimulationResponse(BaseModel):
    simulatedRiskScore: int
    simulatedSeverity: RiskLevel
    factorOfSafety: float
    ruptureHorizonHours: float
    advisory: str

class RiskHistoryItemSchema(BaseModel):
    id: str
    zoneCode: str
    timestamp: str
    riskScore: int
    severity: RiskLevel
    rainfallContribution: float
    soilMoistureContribution: float
    slopeContribution: float
    factorOfSafety: float
    predictionHorizon: str
    advisory: Optional[str] = None

class RiskHistoryResponse(BaseModel):
    success: bool
    zoneCode: str
    count: int
    data: List[RiskHistoryItemSchema]

