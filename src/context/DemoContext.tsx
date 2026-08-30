import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  RiskZone, 
  SensorReading, 
  WeatherReading, 
  SatelliteObservation, 
  RoadSegment, 
  Alert, 
  FieldReport, 
  EmergencyPriority,
  NavigationTab,
  RiskLevel
} from '../types';
import { 
  initialRiskZones, 
  initialSensors, 
  initialWeatherReading, 
  initialSatelliteObservation, 
  initialRoadSegments, 
  initialAlerts, 
  initialFieldReports, 
  initialEmergencyPriorities 
} from '../data/demoData';
import { 
  dashboardService, 
  alertService, 
  reportService, 
  riskService 
} from '../services';
import { scenarioApi } from '../services/allApis';
export type DemoStage = 1 | 2 | 3 | 4 | 5 | 6;
interface DemoScenario {
  id: string;
  name: string;
  location: string;
  description: string;
}
export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'aizawl-monsoon',
    name: 'Aizawl Hunthar Escarpment Flash Surge',
    location: 'Aizawl, Mizoram (NH-54)',
    description: 'Sudden high-intensity cloudburst elevates pore pressure and triggers continuous tilt acceleration on Zone N-07.'
  },
  {
    id: 'sonapur-corridor',
    name: 'Sonapur NH-06 Mudflow Blockage',
    location: 'East Jaintia Hills, Meghalaya',
    description: 'Massive tributary discharge and loose limestone slide cut off the Barak Valley lifeline corridor.'
  },
  {
    id: 'gangtok-seismic',
    name: 'Gangtok 9th Mile Tension Crack Propagation',
    location: 'Gangtok, Sikkim (NH-10)',
    description: 'Ground recon reports tension fissures expanding alongside Sentinel-1 InSAR downslope acceleration.'
  }
];
export interface DemoContextType {
  zones: RiskZone[];
  selectedZoneCode: string;
  selectedZone: RiskZone;
  sensors: SensorReading[];
  weather: WeatherReading;
  satellite: SatelliteObservation;
  roads: RoadSegment[];
  alerts: Alert[];
  reports: FieldReport[];
  emergencyPriorities: EmergencyPriority[];
  
  // API Connection State
  apiSource: 'BACKEND_API' | 'DEMO_FALLBACK';
  isApiLoading: boolean;
  refreshBackendData: () => Promise<void>;
  
  // Navigation
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  setSelectedZoneCode: (code: string) => void;
  
  // Demo simulation state
  demoStage: DemoStage;
  demoStageTitle: string;
  isAutoPlaying: boolean;
  simulationSpeedMs: number;
  activeScenarioId: string;
  factorOfSafety: number; // live computed from selected zone risk score
  
  // Controls
  nextDemoStage: () => void;
  prevDemoStage: () => void;
  setDemoStage: (stage: DemoStage) => void;
  toggleAutoPlay: () => void;
  resetToBaseline: () => void;
  setScenario: (scenarioId: string) => void;
  
  // Actions
  acknowledgeAlert: (alertId: string) => void;
  submitFieldReport: (report: Omit<FieldReport, 'id' | 'ticketNumber' | 'timestamp' | 'status' | 'confidenceScore'>) => void;
  updateReportStatus: (id: string, status: FieldReport['status'], notes?: string) => void;
  
  // Audio chime
  audioWarningMuted: boolean;
  toggleAudioWarning: () => void;
}
const STAGE_TITLES: Record<DemoStage, string> = {
  1: 'Stage 1: Stable Baseline Monitoring (Normal)',
  2: 'Stage 2: Rainfall Intensification (+28 mm/hr)',
  3: 'Stage 3: Subsurface Pore Pressure & Moisture Saturation',
  4: 'Stage 4: InSAR Creep & Angular Tilt Acceleration',
  5: 'Stage 5: CRITICAL Alert Generated & DDMA Dispatch',
  6: 'Stage 6: Post-Event Recovery & Retaining Retrigger Checks (Recovery)'
};
const DemoContext = createContext<DemoContextType | undefined>(undefined);
export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zones, setZones] = useState<RiskZone[]>(initialRiskZones);
  const [selectedZoneCode, setSelectedZoneCode] = useState<string>('N-07');
  const [sensors, setSensors] = useState<SensorReading[]>(initialSensors);
  const [weather, setWeather] = useState<WeatherReading>(initialWeatherReading);
  const [satellite, setSatellite] = useState<SatelliteObservation>(initialSatelliteObservation);
  const [roads, setRoads] = useState<RoadSegment[]>(initialRoadSegments);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [reports, setReports] = useState<FieldReport[]>(initialFieldReports);
  const [emergencyPriorities, setEmergencyPriorities] = useState<EmergencyPriority[]>(initialEmergencyPriorities);
  
  // API State
  const [apiSource, setApiSource] = useState<'BACKEND_API' | 'DEMO_FALLBACK'>('BACKEND_API');
  const [isApiLoading, setIsApiLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [demoStage, setDemoStageState] = useState<DemoStage>(5); // default to dramatic critical command view
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [simulationSpeedMs, setSimulationSpeedMs] = useState<number>(4000);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('aizawl-monsoon');
  const [audioWarningMuted, setAudioWarningMuted] = useState<boolean>(false);
  const selectedZone = zones.find((z) => z.code === selectedZoneCode) || zones[0];
  // Helper to play synthesized radar beep (using Web Audio API when allowed)
  const playAlertChime = useCallback(() => {
    if (audioWarningMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio autoplay may be guarded by browser policy
    }
  }, [audioWarningMuted]);
  // Initial Fetch from Backend REST API
  const refreshBackendData = useCallback(async () => {
    setIsApiLoading(true);
    try {
      const [res, reportsRes] = await Promise.all([
        dashboardService.getDashboard(),
        reportService.getAllReports()
      ]);
      setApiSource(res.source);
      if (res.data) {
        if (res.data.zones && res.data.zones.length > 0) setZones(res.data.zones);
        if (res.data.sensors && res.data.sensors.length > 0) setSensors(res.data.sensors);
        if (res.data.weather) setWeather(res.data.weather);
        if (res.data.satellite) setSatellite(res.data.satellite);
        if (res.data.roads && res.data.roads.length > 0) setRoads(res.data.roads);
        if (res.data.alerts && res.data.alerts.length > 0) setAlerts(res.data.alerts);
        if (res.data.emergencyPriorities && res.data.emergencyPriorities.length > 0) {
          setEmergencyPriorities(res.data.emergencyPriorities);
        }
      }
      if (reportsRes.data && reportsRes.data.length > 0) {
        setReports(reportsRes.data);
      }
    } catch (e) {
      console.warn('Initial dashboard sync fallback:', e);
      setApiSource('DEMO_FALLBACK');
    } finally {
      setIsApiLoading(false);
    }
  }, []);
  useEffect(() => {
    refreshBackendData();
  }, [refreshBackendData]);
  // Apply stage parameters
  const applyStageData = useCallback((stage: DemoStage) => {
    setDemoStageState(stage);
    // Sync with backend scenario engine (fire-and-forget)
    scenarioApi.syncStage(stage, activeScenarioId).catch(() => {});
    
    // Scale the target zone (and non-target baseline zones) according to stage
    const targetZoneCode = activeScenarioId === 'sonapur-corridor' ? 'N-03' : activeScenarioId === 'gangtok-seismic' ? 'N-11' : 'N-07';
    const targetSensorNodeId = activeScenarioId === 'sonapur-corridor' ? 'SN-03B' : activeScenarioId === 'gangtok-seismic' ? 'SN-11C' : 'SN-07A';
    setZones((prev) =>
      prev.map((z) => {
        if (z.code === targetZoneCode) {
          let riskScore = 38;
          let riskLevel: RiskLevel = 'LOW';
          let rainfallRateMmHr = 4;
          let accumulation24hMm = 16;
          let soilMoisturePct = 34;
          let porePressureKPa = 14.2;
          let insarDisplacementMm = 0.6;
          let slopeInstabilityPct = 28;
          let roadStatus: 'OPEN' | 'AT RISK' | 'BLOCKED' = 'OPEN';
          let forecastTrend: 'INCREASING' | 'STABLE' | 'DECREASING' = 'STABLE';
          let forecastTo: RiskLevel = 'LOW';
          if (stage === 1) {
            riskScore = 38; riskLevel = 'LOW'; rainfallRateMmHr = 4; accumulation24hMm = 16;
            soilMoisturePct = 34; porePressureKPa = 14.2; insarDisplacementMm = 0.6; slopeInstabilityPct = 28;
            roadStatus = 'OPEN'; forecastTrend = 'STABLE'; forecastTo = 'LOW';
          } else if (stage === 2) {
            riskScore = 58; riskLevel = 'MODERATE'; rainfallRateMmHr = 22; accumulation24hMm = 52;
            soilMoisturePct = 48; porePressureKPa = 26.5; insarDisplacementMm = 1.8; slopeInstabilityPct = 49;
            roadStatus = 'OPEN'; forecastTrend = 'INCREASING'; forecastTo = 'HIGH';
          } else if (stage === 3) {
            riskScore = 76; riskLevel = 'HIGH'; rainfallRateMmHr = 34; accumulation24hMm = 86;
            soilMoisturePct = 62; porePressureKPa = 42.0; insarDisplacementMm = 4.1; slopeInstabilityPct = 68;
            roadStatus = 'AT RISK'; forecastTrend = 'INCREASING'; forecastTo = 'CRITICAL';
          } else if (stage === 4) {
            riskScore = 86; riskLevel = 'HIGH'; rainfallRateMmHr = 40; accumulation24hMm = 104;
            soilMoisturePct = 70; porePressureKPa = 52.6; insarDisplacementMm = 6.8; slopeInstabilityPct = 76;
            roadStatus = 'AT RISK'; forecastTrend = 'INCREASING'; forecastTo = 'CRITICAL';
          } else if (stage === 5) {
            riskScore = 92; riskLevel = 'CRITICAL'; rainfallRateMmHr = 42.5; accumulation24hMm = 168.4;
            soilMoisturePct = 84; porePressureKPa = 58.4; insarDisplacementMm = -28.4; slopeInstabilityPct = 91;
            roadStatus = 'BLOCKED'; forecastTrend = 'INCREASING'; forecastTo = 'CRITICAL';
          } else if (stage === 6) {
            riskScore = 48; riskLevel = 'MODERATE'; rainfallRateMmHr = 5; accumulation24hMm = 120;
            soilMoisturePct = 55; porePressureKPa = 28.0; insarDisplacementMm = -28.8; slopeInstabilityPct = 45;
            roadStatus = 'OPEN'; forecastTrend = 'DECREASING'; forecastTo = 'LOW';
          }
          return {
            ...z,
            riskScore,
            riskLevel,
            rainfallRateMmHr,
            accumulation24hMm,
            soilMoisturePct,
            porePressureKPa,
            insarDisplacementMm,
            slopeInstabilityPct,
            roadStatus,
            forecast6h: {
              from: z.riskLevel,
              to: forecastTo,
              projectedScore: Math.min(99, Math.round(riskScore * 1.05)),
              trend: forecastTrend
            }
          };
        }
        return z;
      })
    );
    // Update Weather
    setWeather((prev) => {
      let rainfallRateMmHr = 4;
      let accumulation24hMm = 16;
      let intensityLabel: WeatherReading['intensityLabel'] = 'NORMAL';
      let trend: WeatherReading['trend'] = 'STABLE';
      if (stage === 1) {
        rainfallRateMmHr = 4; accumulation24hMm = 16; intensityLabel = 'NORMAL'; trend = 'STABLE';
      } else if (stage === 2) {
        rainfallRateMmHr = 22; accumulation24hMm = 52; intensityLabel = 'MODERATE RAIN'; trend = 'INCREASING';
      } else if (stage === 3) {
        rainfallRateMmHr = 34; accumulation24hMm = 86; intensityLabel = 'HEAVY DOWNPOUR'; trend = 'INCREASING';
      } else if (stage === 4) {
        rainfallRateMmHr = 40; accumulation24hMm = 104; intensityLabel = 'HEAVY DOWNPOUR'; trend = 'INCREASING';
      } else if (stage === 5) {
        rainfallRateMmHr = 42.5; accumulation24hMm = 168.4; intensityLabel = 'TORRENTIAL MONSOON'; trend = 'INCREASING';
      } else if (stage === 6) {
        rainfallRateMmHr = 5; accumulation24hMm = 120; intensityLabel = 'NORMAL'; trend = 'DECREASING';
      }
      return {
        ...prev,
        rainfallRateMmHr,
        accumulation24hMm,
        intensityLabel,
        trend
      };
    });
    // Update Sensors
    setSensors((prev) =>
      prev.map((s) => {
        if (s.nodeId === targetSensorNodeId) {
          let soilMoisturePct = 34;
          let slopeTiltDeg = 0.9;
          let porePressureKPa = 14.2;
          let status: SensorReading['status'] = 'ONLINE';
          let history: SensorReading['history'] = [];
          if (stage === 1) {
            soilMoisturePct = 34; slopeTiltDeg = 0.9; porePressureKPa = 14.2; status = 'ONLINE';
            history = [
              { timestamp: '10:00', soilMoisture: 30, tilt: 0.8, porePressure: 12 },
              { timestamp: '11:00', soilMoisture: 31, tilt: 0.8, porePressure: 12.5 },
              { timestamp: '12:00', soilMoisture: 32, tilt: 0.9, porePressure: 13 },
              { timestamp: '13:00', soilMoisture: 33, tilt: 0.9, porePressure: 13.5 },
              { timestamp: '14:00', soilMoisture: 34, tilt: 0.9, porePressure: 14.2 }
            ];
          } else if (stage === 2) {
            soilMoisturePct = 48; slopeTiltDeg = 1.8; porePressureKPa = 26.5; status = 'ONLINE';
            history = [
              { timestamp: '10:00', soilMoisture: 34, tilt: 0.9, porePressure: 14.2 },
              { timestamp: '11:00', soilMoisture: 38, tilt: 1.1, porePressure: 17 },
              { timestamp: '12:00', soilMoisture: 41, tilt: 1.3, porePressure: 20 },
              { timestamp: '13:00', soilMoisture: 45, tilt: 1.6, porePressure: 23.5 },
              { timestamp: '14:00', soilMoisture: 48, tilt: 1.8, porePressure: 26.5 }
            ];
          } else if (stage === 3) {
            soilMoisturePct = 62; slopeTiltDeg = 3.4; porePressureKPa = 42.0; status = 'WARNING';
            history = [
              { timestamp: '10:00', soilMoisture: 48, tilt: 1.8, porePressure: 26.5 },
              { timestamp: '11:00', soilMoisture: 52, tilt: 2.2, porePressure: 31 },
              { timestamp: '12:00', soilMoisture: 55, tilt: 2.6, porePressure: 35 },
              { timestamp: '13:00', soilMoisture: 58, tilt: 3.0, porePressure: 38.5 },
              { timestamp: '14:00', soilMoisture: 62, tilt: 3.4, porePressure: 42.0 }
            ];
          } else if (stage === 4) {
            soilMoisturePct = 70; slopeTiltDeg = 4.7; porePressureKPa = 52.6; status = 'WARNING';
            history = [
              { timestamp: '10:00', soilMoisture: 62, tilt: 3.4, porePressure: 42.0 },
              { timestamp: '11:00', soilMoisture: 64, tilt: 3.7, porePressure: 45 },
              { timestamp: '12:00', soilMoisture: 66, tilt: 4.0, porePressure: 48 },
              { timestamp: '13:00', soilMoisture: 68, tilt: 4.4, porePressure: 50.5 },
              { timestamp: '14:00', soilMoisture: 70, tilt: 4.7, porePressure: 52.6 }
            ];
          } else if (stage === 5) {
            soilMoisturePct = 84; slopeTiltDeg = 5.6; porePressureKPa = 58.4; status = 'WARNING';
            history = [
              { timestamp: '10:00', soilMoisture: 70, tilt: 4.7, porePressure: 52.6 },
              { timestamp: '11:00', soilMoisture: 73, tilt: 5.0, porePressure: 54.5 },
              { timestamp: '12:00', soilMoisture: 76, tilt: 5.2, porePressure: 56 },
              { timestamp: '13:00', soilMoisture: 80, tilt: 5.4, porePressure: 57.5 },
              { timestamp: '14:00', soilMoisture: 84, tilt: 5.6, porePressure: 58.4 }
            ];
          } else if (stage === 6) {
            soilMoisturePct = 55; slopeTiltDeg = 5.7; porePressureKPa = 28.0; status = 'ONLINE';
            history = [
              { timestamp: '10:00', soilMoisture: 84, tilt: 5.6, porePressure: 58.4 },
              { timestamp: '11:00', soilMoisture: 70, tilt: 5.7, porePressure: 50 },
              { timestamp: '12:00', soilMoisture: 65, tilt: 5.7, porePressure: 42 },
              { timestamp: '13:00', soilMoisture: 60, tilt: 5.7, porePressure: 34 },
              { timestamp: '14:00', soilMoisture: 55, tilt: 5.7, porePressure: 28 }
            ];
          }
          return {
            ...s,
            soilMoisturePct,
            slopeTiltDeg,
            porePressureKPa,
            status,
            history
          };
        }
        return s;
      })
    );
    // Update satellite displacement for targeted zone
    setSatellite((prev) => {
      let surfaceMotionMm = -15.0;
      let displacementStatus: SatelliteObservation['displacementStatus'] = 'STABLE';
      if (stage === 1) {
        surfaceMotionMm = -0.6; displacementStatus = 'STABLE';
      } else if (stage === 2) {
        surfaceMotionMm = -1.8; displacementStatus = 'STABLE';
      } else if (stage === 3) {
        surfaceMotionMm = -4.1; displacementStatus = 'DISPLACEMENT DETECTED';
      } else if (stage === 4) {
        surfaceMotionMm = -6.8; displacementStatus = 'DISPLACEMENT DETECTED';
      } else if (stage === 5) {
        surfaceMotionMm = -28.4; displacementStatus = 'ELEVATED VELOCITY';
      } else if (stage === 6) {
        surfaceMotionMm = -28.8; displacementStatus = 'STABLE';
      }
      return {
        ...prev,
        surfaceMotionMm,
        displacementStatus
      };
    });
    // Update Roads Segment status dynamically
    setRoads((prev) =>
      prev.map((r) => {
        if (r.connectedZones.includes(targetZoneCode)) {
          let status: RoadSegment['status'] = 'OPEN';
          if (stage >= 5) status = 'BLOCKED';
          else if (stage >= 3) status = 'AT RISK';
          return {
            ...r,
            status
          };
        }
        return r;
      })
    );
    // Dynamically Filter & Update Alerts
    setAlerts((prev) => {
      // Start with a clean list based on initial alerts or stage
      let updatedAlerts = [...initialAlerts];
      // Filter out the alert for targetZoneCode if stage is low (1 or 2)
      if (stage <= 2) {
        updatedAlerts = updatedAlerts.filter((a) => a.zoneCode !== targetZoneCode);
      } else {
        updatedAlerts = updatedAlerts.map((a) => {
          if (a.zoneCode === targetZoneCode) {
            let severity: RiskLevel = 'HIGH';
            let headline = `SIMULATED ALERT: Accelerated Slope Instability at ${targetZoneCode}`;
            let acknowledged = false;
            let status: Alert['status'] = 'PENDING REVIEW';
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
              playAlertChime();
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
              riskScore: stage === 3 ? 76 : stage === 4 ? 86 : stage === 5 ? 92 : 48
            };
          }
          return a;
        });
      }
      return updatedAlerts;
    });
    // Dynamically update Emergency Priorities based on risk scores
    setEmergencyPriorities((prev) => {
      return initialEmergencyPriorities.map((ep) => {
        if (ep.zoneCode === targetZoneCode) {
          let riskScore = 38;
          let severity: RiskLevel = 'LOW';
          let evacuationStatus = ep.evacuationStatus;
          let status = 'STANDBY';
          if (stage === 1) {
            riskScore = 38; severity = 'LOW'; status = 'STANDBY'; evacuationStatus = 'STANDBY MONITORING';
          } else if (stage === 2) {
            riskScore = 58; severity = 'MODERATE'; status = 'STANDBY'; evacuationStatus = 'STANDBY MONITORING';
          } else if (stage === 3) {
            riskScore = 76; severity = 'HIGH'; status = 'MONITORING INTENSIVE'; evacuationStatus = 'IMMEDIATE FIELD VERIFICATION';
          } else if (stage === 4) {
            riskScore = 86; severity = 'HIGH'; status = 'ELEVATED HAZARD'; evacuationStatus = 'ROAD CORRIDOR AT RISK';
          } else if (stage === 5) {
            riskScore = 92; severity = 'CRITICAL'; status = 'ACTIVE EMERGENCY'; evacuationStatus = 'PRE-EMPTIVE EVACUATION ORDER';
          } else if (stage === 6) {
            riskScore = 48; severity = 'MODERATE'; status = 'STANDBY'; evacuationStatus = 'STANDBY MONITORING';
          }
          return {
            ...ep,
            riskScore,
            severity,
            evacuationStatus,
            status,
          };
        }
        return ep;
      }).sort((a, b) => b.riskScore - a.riskScore).map((ep, idx) => ({
        ...ep,
        rank: idx + 1
      }));
    });
  }, [playAlertChime, activeScenarioId]);
  const nextDemoStage = () => {
    const next = (demoStage >= 6 ? 1 : ((demoStage + 1) as DemoStage));
    applyStageData(next);
  };
  const prevDemoStage = () => {
    const prev = (demoStage <= 1 ? 6 : ((demoStage - 1) as DemoStage));
    applyStageData(prev);
  };
  const setDemoStage = (stage: DemoStage) => {
    applyStageData(stage);
  };
  const toggleAutoPlay = () => {
    setIsAutoPlaying((v) => !v);
  };
  const resetToBaseline = () => {
    setIsAutoPlaying(false);
    applyStageData(1);
  };
  const setScenario = (scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    if (scenarioId === 'sonapur-corridor') {
      setSelectedZoneCode('N-03');
    } else if (scenarioId === 'gangtok-seismic') {
      setSelectedZoneCode('N-11');
    } else {
      setSelectedZoneCode('N-07');
    }
    applyStageData(5);
  };
  // Auto-play loop for demo showcase
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setDemoStageState((current) => {
        const next = (current >= 6 ? 1 : ((current + 1) as DemoStage));
        applyStageData(next);
        return next;
      });
    }, simulationSpeedMs);
    return () => clearInterval(interval);
  }, [isAutoPlaying, simulationSpeedMs, applyStageData]);
  const acknowledgeAlert = async (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true, status: 'DISPATCHED' } : a))
    );
    try {
      await alertService.acknowledgeAlert(alertId);
    } catch (e) {
      console.warn('Background alert acknowledge API call fallback:', e);
    }
  };
  const submitFieldReport = async (reportData: Omit<FieldReport, 'id' | 'ticketNumber' | 'timestamp' | 'status' | 'confidenceScore'>) => {
    const tempId = `rep-${Date.now()}`;
    const newReport: FieldReport = {
      ...reportData,
      id: tempId,
      ticketNumber: `FR-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now (T-0:00)',
      status: 'NEW',
      confidenceScore: 95,
      triageNotes: 'Instant GPS timestamp verified. Spatial clustering matched with sensor telemetry.'
    };
    setReports((prev) => [newReport, ...prev]);
    playAlertChime();
    try {
      const res = await reportService.createReport(reportData);
      if (res.data && res.data.id) {
        setReports((prev) => prev.map((r) => (r.id === tempId ? res.data : r)));
      }
    } catch (e) {
      console.warn('Background create report API call fallback:', e);
    }
  };
  const updateReportStatus = async (id: string, status: FieldReport['status'], notes?: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, triageNotes: notes || r.triageNotes } : r))
    );
    try {
      await reportService.updateReportStatus(id, status, notes);
    } catch (e) {
      console.warn('Background update report API call fallback:', e);
    }
  };
  const toggleAudioWarning = () => {
    setAudioWarningMuted((v) => !v);
  };
  // Compute derived Factor of Safety from selected zone (using the Render scope selectedZone directly)
  const factorOfSafety = Number((1.85 - (selectedZone.riskScore / 100) * 1.1).toFixed(2));
  return (
    <DemoContext.Provider
      value={{
        zones,
        selectedZoneCode,
        selectedZone,
        factorOfSafety,
        sensors,
        weather,
        satellite,
        roads,
        alerts,
        reports,
        emergencyPriorities,
        apiSource,
        isApiLoading,
        refreshBackendData: async () => {},
        activeTab,
        setActiveTab,
        setSelectedZoneCode,
        demoStage,
        demoStageTitle: STAGE_TITLES[demoStage],
        isAutoPlaying,
        simulationSpeedMs,
        activeScenarioId,
        nextDemoStage,
        prevDemoStage,
        setDemoStage,
        toggleAutoPlay,
        resetToBaseline,
        setScenario,
        acknowledgeAlert,
        submitFieldReport,
        updateReportStatus,
        audioWarningMuted,
        toggleAudioWarning
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};
export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
