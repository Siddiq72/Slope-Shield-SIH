import fs from "fs";
import path from "path";
import {
  serverRiskZones,
  serverSensors,
  serverAlerts,
  serverFieldReports,
  serverEmergencyPriorities,
  ServerRiskZone,
  ServerFieldReport
} from "../data/store";
import { SensorReading, Alert, EmergencyPriority } from "../../src/types";
import { calculateRisk } from "../services/riskEngine";
import { STAGE_WEATHER as STAGE_WEATHER_MAP, STAGE_TELEMETRY as STAGE_TELEMETRY_MAP, STAGE_SENSOR_HISTORIES as sensorHistories } from "../../src/data/stageMaps";

export type ServerSensor = SensorReading;
export type ServerAlert = Alert;
export type ServerEmergencyPriority = EmergencyPriority;

export interface ServerRiskAssessment {
  id: string;
  zoneCode: string;
  timestamp: string;
  riskScore: number;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  rainfallContribution: number;
  soilMoistureContribution: number;
  slopeContribution: number;
  factorOfSafety: number;
  predictionHorizon: string;
  advisory?: string;
  createdAt: string;
}

export interface PersistentDatabaseSchema {
  zones: ServerRiskZone[];
  sensors: ServerSensor[];
  alerts: ServerAlert[];
  reports: ServerFieldReport[];
  emergencyPriorities: ServerEmergencyPriority[];
  riskAssessments: ServerRiskAssessment[];
  meta: {
    initializedAt: string;
    lastSavedAt: string;
    databaseType: string;
    version: string;
  };
}

const DB_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DB_DIR, "slopeshield_db.json");

const initialHistoricalAssessments: ServerRiskAssessment[] = [
  {
    id: "ra-1",
    zoneCode: "N-07",
    timestamp: "T-16h (06:00 IST)",
    riskScore: 42,
    severity: "LOW",
    rainfallContribution: 0.20,
    soilMoistureContribution: 0.20,
    slopeContribution: 0.30,
    factorOfSafety: 1.85,
    predictionHorizon: "6h",
    advisory: "Normal antecedent baseline conditions.",
    createdAt: new Date(Date.now() - 16 * 3600000).toISOString()
  },
  {
    id: "ra-2",
    zoneCode: "N-07",
    timestamp: "T-10h (10:00 IST)",
    riskScore: 63,
    severity: "MODERATE",
    rainfallContribution: 0.30,
    soilMoistureContribution: 0.25,
    slopeContribution: 0.25,
    factorOfSafety: 1.45,
    predictionHorizon: "6h",
    advisory: "Monsoon surge initiates subsurface moisture infiltration.",
    createdAt: new Date(Date.now() - 10 * 3600000).toISOString()
  },
  {
    id: "ra-3",
    zoneCode: "N-07",
    timestamp: "T-4h (14:00 IST)",
    riskScore: 78,
    severity: "HIGH",
    rainfallContribution: 0.35,
    soilMoistureContribution: 0.30,
    slopeContribution: 0.20,
    factorOfSafety: 1.15,
    predictionHorizon: "6h",
    advisory: "Accelerated creep and pore pressure spike.",
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString()
  },
  {
    id: "ra-4",
    zoneCode: "N-07",
    timestamp: "T-0h (18:00 IST)",
    riskScore: 92,
    severity: "CRITICAL",
    rainfallContribution: 0.35,
    soilMoistureContribution: 0.25,
    slopeContribution: 0.20,
    factorOfSafety: 0.76,
    predictionHorizon: "6h",
    advisory: "Active shear bedding plane failure. Immediate evacuation protocol warranted.",
    createdAt: new Date().toISOString()
  }
];



class LocalDatabaseManager {
  private data: PersistentDatabaseSchema;
  private activeScenarioStage: number = 5;
  private activeScenarioId: string = "aizawl-monsoon";

  constructor() {
    this.data = this.loadOrInitialize();
  }

  public setScenario(stage: number, scenarioId?: string) {
    if (stage >= 1 && stage <= 6) {
      this.activeScenarioStage = stage;
      if (scenarioId) {
        this.activeScenarioId = scenarioId;
      }
    }
  }

  public getScenarioState() {
    const targetZoneCode = this.activeScenarioId === 'sonapur-corridor' ? 'N-03' : this.activeScenarioId === 'gangtok-seismic' ? 'N-11' : 'N-07';
    const zone = this.getZones().find(z => z.code === targetZoneCode) || this.getZones()[0];
    const score = zone.riskScore;
    return {
      activeScenario: {
        stage: this.activeScenarioStage,
        scenarioId: this.activeScenarioId,
        updatedAt: new Date().toISOString()
      },
      factorOfSafety: Number((1.85 - (score / 100) * 1.1).toFixed(2)),
      ruptureHorizonHours: score >= 85 ? 2.5 : score >= 70 ? 5.0 : 12.0
    };
  }

  private loadOrInitialize(): PersistentDatabaseSchema {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed.zones && parsed.alerts && parsed.reports) {
          console.log("[SlopeShield DB] Loaded persistent database from disk (.data/slopeshield_db.json)");
          return {
            ...parsed,
            riskAssessments: parsed.riskAssessments || initialHistoricalAssessments
          };
        }
      }
    } catch (e) {
      console.warn("[SlopeShield DB] Could not read existing DB file, seeding new instance:", e);
    }

    const seeded: PersistentDatabaseSchema = {
      zones: [...serverRiskZones],
      sensors: [...serverSensors],
      alerts: [...serverAlerts],
      reports: [...serverFieldReports],
      emergencyPriorities: [...serverEmergencyPriorities],
      riskAssessments: [...initialHistoricalAssessments],
      meta: {
        initializedAt: new Date().toISOString(),
        lastSavedAt: new Date().toISOString(),
        databaseType: "SQLite / Local JSON Document Store",
        version: "3.0.0"
      }
    };

    this.saveToDisk(seeded);
    return seeded;
  }

  private saveToDisk(dataToSave?: PersistentDatabaseSchema) {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      const toWrite = dataToSave || this.data;
      toWrite.meta.lastSavedAt = new Date().toISOString();
      fs.writeFileSync(DB_FILE, JSON.stringify(toWrite, null, 2), "utf-8");
    } catch (e) {
      console.error("[SlopeShield DB] Error writing persistent database:", e);
    }
  }

  // Zone operations
  public getZones(): ServerRiskZone[] {
    const stage = this.activeScenarioStage;
    const targetZoneCode = this.activeScenarioId === 'sonapur-corridor' ? 'N-03' : this.activeScenarioId === 'gangtok-seismic' ? 'N-11' : 'N-07';

    const stageTelemetry = STAGE_TELEMETRY_MAP[stage] || STAGE_TELEMETRY_MAP[5];
    const stageWeather = STAGE_WEATHER_MAP[stage] || STAGE_WEATHER_MAP[5];

    return this.data.zones.map((z) => {
      let updatedZone = { ...z };
      if (z.code === targetZoneCode) {
        const trend = stage === 6 ? 'DECREASING' : stage >= 2 ? 'INCREASING' : 'STABLE';
        const forecastTo = stage === 6 ? 'LOW' : stage >= 3 ? 'CRITICAL' : stage === 2 ? 'HIGH' : 'LOW';

        updatedZone = {
          ...z,
          rainfallRateMmHr: stageWeather.rainfallRateMmHr,
          accumulation24hMm: stageWeather.accumulation24hMm,
          soilMoisturePct: stageTelemetry.soilMoisturePct,
          porePressureKPa: stageTelemetry.porePressureKPa,
          insarDisplacementMm: stageTelemetry.insarDisplacementMm,
          slopeInstabilityPct: stageTelemetry.slopeInstabilityPct,
          roadStatus: stageTelemetry.roadStatus,
          recommendedAction: stageTelemetry.recommendedAction,
          forecast6h: {
            from: z.riskLevel,
            to: forecastTo,
            projectedScore: 0, // Will be updated below
            trend: trend
          }
        };
      }

      // Calculate risk dynamically for EVERY zone using the risk engine!
      const calc = calculateRisk({
        rainfallRateMmHr: updatedZone.rainfallRateMmHr,
        accumulation24hMm: updatedZone.accumulation24hMm,
        soilMoisturePct: updatedZone.soilMoisturePct,
        porePressureKPa: updatedZone.porePressureKPa,
        slopeInstabilityPct: updatedZone.slopeInstabilityPct,
        insarDisplacementMm: updatedZone.insarDisplacementMm,
        historicalVulnerabilityPct: updatedZone.historicalVulnerabilityPct,
        slopeAngleDeg: updatedZone.slopeAngleDeg
      });

      updatedZone.riskScore = calc.score;
      updatedZone.riskLevel = calc.severity;
      updatedZone.forecast6h = {
        ...updatedZone.forecast6h,
        from: calc.severity,
        projectedScore: Math.min(99, Math.round(calc.score * 1.05))
      };

      return updatedZone;
    });
  }

  public getZoneByCode(code: string): ServerRiskZone | undefined {
    return this.getZones().find(
      z => z.code.toLowerCase() === code.toLowerCase() || z.id.toLowerCase() === code.toLowerCase()
    );
  }

  // Sensor operations
  public getSensors(): ServerSensor[] {
    const stage = this.activeScenarioStage;
    const targetZoneCode = this.activeScenarioId === 'sonapur-corridor' ? 'N-03' : this.activeScenarioId === 'gangtok-seismic' ? 'N-11' : 'N-07';
    const targetSensorNodeId = this.activeScenarioId === 'sonapur-corridor' ? 'SN-03B' : this.activeScenarioId === 'gangtok-seismic' ? 'SN-11C' : 'SN-07A';

    const stageTelemetry = STAGE_TELEMETRY_MAP[stage] || STAGE_TELEMETRY_MAP[5];
    const sensorHistory = sensorHistories[stage] || sensorHistories[5];

    return this.data.sensors.map((s) => {
      if (s.nodeId === targetSensorNodeId) {
        return {
          ...s,
          soilMoisturePct: stageTelemetry.soilMoisturePct,
          slopeTiltDeg: stage === 5 ? 5.6 : stage === 4 ? 4.7 : stage === 3 ? 3.4 : stage === 2 ? 1.8 : stage === 6 ? 5.7 : 0.9,
          porePressureKPa: stageTelemetry.porePressureKPa,
          status: stageTelemetry.sensorStatus === 'WARNING' ? 'WARNING' : 'ONLINE',
          history: sensorHistory
        };
      }
      return s;
    });
  }

  // Alert operations
  public getAlerts(): ServerAlert[] {
    const stage = this.activeScenarioStage;
    const targetZoneCode = this.activeScenarioId === 'sonapur-corridor' ? 'N-03' : this.activeScenarioId === 'gangtok-seismic' ? 'N-11' : 'N-07';

    const zones = this.getZones();
    const targetZone = zones.find(z => z.code === targetZoneCode);
    const calculatedScore = targetZone ? targetZone.riskScore : 50;
    const calculatedSeverity = targetZone ? targetZone.riskLevel : 'LOW';

    let alerts = [...this.data.alerts];

    if (stage <= 2) {
      alerts = alerts.filter(a => a.zoneCode !== targetZoneCode);
    } else {
      alerts = alerts.map((a) => {
        if (a.zoneCode === targetZoneCode) {
          let severity = calculatedSeverity;
          let headline = `SIMULATED ALERT: Accelerated Slope Instability at ${targetZoneCode}`;
          let acknowledged = a.acknowledged;
          let status: ServerAlert['status'] = 'PENDING REVIEW';

          if (stage === 3) {
            severity = 'HIGH';
            headline = `ORANGE WARNING: Elevated Subsurface Saturation at ${targetZoneCode}`;
            status = 'PENDING REVIEW';
          } else if (stage === 4) {
            severity = 'HIGH';
            headline = `ORANGE WARNING: InSAR Creep & Tilt Displacement at ${targetZoneCode}`;
            status = 'DISPATCHED';
          } else if (stage === 5) {
            severity = 'CRITICAL';
            headline = `RED ALERT: Imminent Slope Shear Failure at ${targetZoneCode}`;
            status = 'DISPATCHED';
          } else if (stage === 6) {
            severity = 'MODERATE';
            headline = `RECOVERY ALERT: Stabilization & Cleanup In Progress at ${targetZoneCode}`;
            status = 'DISPATCHED';
            acknowledged = true;
          }

          return {
            ...a,
            severity,
            headline,
            acknowledged,
            status,
            riskScore: calculatedScore
          };
        }
        return a;
      });
    }
    return alerts;
  }

  public acknowledgeAlert(alertId: string): boolean {
    let found = false;
    this.data.alerts = this.data.alerts.map(a => {
      if (a.id === alertId || a.alertCode === alertId) {
        found = true;
        return { ...a, acknowledged: true };
      }
      return a;
    });
    if (found) {
      this.saveToDisk();
    }
    return found;
  }

  public addAlert(alert: ServerAlert) {
    this.data.alerts.unshift(alert);
    this.saveToDisk();
  }

  // Field Report operations
  public getReports(): ServerFieldReport[] {
    return this.data.reports;
  }

  public addReport(report: ServerFieldReport) {
    this.data.reports.unshift(report);
    this.saveToDisk();
  }

  public updateReport(reportId: string, status?: string, notes?: string): boolean {
    let found = false;
    this.data.reports = this.data.reports.map(r => {
      if (r.id === reportId || r.ticketNumber === reportId) {
        found = true;
        return {
          ...r,
          status: status || r.status,
          triageNotes: notes !== undefined ? notes : r.triageNotes
        };
      }
      return r;
    });
    if (found) {
      this.saveToDisk();
    }
    return found;
  }

  // Emergency Priorities
  public getEmergencyPriorities(): ServerEmergencyPriority[] {
    const stage = this.activeScenarioStage;
    const targetZoneCode = this.activeScenarioId === 'sonapur-corridor' ? 'N-03' : this.activeScenarioId === 'gangtok-seismic' ? 'N-11' : 'N-07';

    const zones = this.getZones();

    return this.data.emergencyPriorities.map((ep) => {
      const zone = zones.find(z => z.code === ep.zoneCode);
      if (zone) {
        let status = 'STANDBY';
        let evacuationStatus = ep.evacuationStatus;

        if (stage === 1) {
          status = 'STANDBY'; evacuationStatus = 'STANDBY MONITORING';
        } else if (stage === 2) {
          status = 'STANDBY'; evacuationStatus = 'STANDBY MONITORING';
        } else if (stage === 3) {
          status = 'MONITORING INTENSIVE'; evacuationStatus = 'IMMEDIATE FIELD VERIFICATION';
        } else if (stage === 4) {
          status = 'ELEVATED HAZARD'; evacuationStatus = 'ROAD CORRIDOR AT RISK';
        } else if (stage === 5) {
          status = 'ACTIVE EMERGENCY'; evacuationStatus = 'PRE-EMPTIVE EVACUATION ORDER';
        } else if (stage === 6) {
          status = 'STANDBY'; evacuationStatus = 'STANDBY MONITORING';
        }

        return {
          ...ep,
          riskScore: zone.riskScore,
          severity: zone.riskLevel,
          status,
          evacuationStatus
        };
      }
      return ep;
    }).sort((a, b) => b.riskScore - a.riskScore).map((ep, idx) => ({
      ...ep,
      rank: idx + 1
    }));
  }

  // Risk Assessments / History
  public getRiskHistory(zoneCode: string): ServerRiskAssessment[] {
    const matched = this.data.riskAssessments.filter(
      ra => ra.zoneCode.toLowerCase() === zoneCode.toLowerCase()
    );
    return matched.length > 0 ? matched : this.data.riskAssessments;
  }

  public addRiskAssessment(assessment: ServerRiskAssessment) {
    this.data.riskAssessments.push(assessment);
    this.saveToDisk();
  }

  public getDatabaseInfo() {
    return {
      type: "SQLite & Local Persistent Store",
      status: "ONLINE",
      recordCount: this.data.zones.length,
      reportsCount: this.data.reports.length,
      alertsCount: this.data.alerts.length,
      lastSavedAt: this.data.meta.lastSavedAt
    };
  }
}

export const dbStore = new LocalDatabaseManager();
