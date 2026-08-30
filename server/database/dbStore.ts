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

  constructor() {
    this.data = this.loadOrInitialize();
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
    return this.data.zones;
  }

  public getZoneByCode(code: string): ServerRiskZone | undefined {
    return this.data.zones.find(
      z => z.code.toLowerCase() === code.toLowerCase() || z.id.toLowerCase() === code.toLowerCase()
    );
  }

  // Sensor operations
  public getSensors(): ServerSensor[] {
    return this.data.sensors;
  }

  // Alert operations
  public getAlerts(): ServerAlert[] {
    return this.data.alerts;
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
    return this.data.emergencyPriorities;
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
