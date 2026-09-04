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
import { STAGE_WEATHER, STAGE_TELEMETRY, STAGE_SENSOR_HISTORIES } from '../data/stageMaps';
import { calculateRisk } from '../../server/services/riskEngine';
import { evaluateEarlyWarning, EarlyWarningResult } from '../../server/services/earlyWarningEngine';
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

  // Early-Warning Decision Engine Output
  earlyWarningResult: EarlyWarningResult | null;
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
  const [earlyWarningResult, setEarlyWarningResult] = useState<EarlyWarningResult | null>(null);
  
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
        let updatedZone = { ...z };
        if (z.code === targetZoneCode) {
          const telemetry = STAGE_TELEMETRY[stage];
          const weatherData = STAGE_WEATHER[stage];
          const trend = stage === 6 ? 'DECREASING' : stage >= 2 ? 'INCREASING' : 'STABLE';
          const forecastTo = stage === 6 ? 'LOW' : stage >= 3 ? 'CRITICAL' : stage === 2 ? 'HIGH' : 'LOW';

          updatedZone = {
            ...z,
            rainfallRateMmHr: weatherData.rainfallRateMmHr,
            accumulation24hMm: weatherData.accumulation24hMm,
            soilMoisturePct: telemetry.soilMoisturePct,
            porePressureKPa: telemetry.porePressureKPa,
            insarDisplacementMm: telemetry.insarDisplacementMm,
            slopeInstabilityPct: telemetry.slopeInstabilityPct,
            roadStatus: telemetry.roadStatus,
            recommendedAction: telemetry.recommendedAction,
            forecast6h: {
              from: z.riskLevel,
              to: forecastTo,
              projectedScore: 0,
              trend: trend
            }
          };
        }

        // Run the dynamic risk engine calculation for EVERY zone!
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

        return {
          ...updatedZone,
          riskScore: calc.score,
          riskLevel: calc.severity,
          forecast6h: {
            ...updatedZone.forecast6h,
            from: calc.severity,
            projectedScore: Math.min(99, Math.round(calc.score * 1.05))
          }
        };
      })
    );

    // Update Weather
    setWeather((prev) => {
      const stageWeather = STAGE_WEATHER[stage];
      return {
        ...prev,
        rainfallRateMmHr: stageWeather.rainfallRateMmHr,
        accumulation24hMm: stageWeather.accumulation24hMm,
        intensityLabel: stageWeather.intensityLabel as WeatherReading['intensityLabel'],
        trend: stageWeather.trend as WeatherReading['trend']
      };
    });

    // Update Sensors
    setSensors((prev) =>
      prev.map((s) => {
        if (s.nodeId === targetSensorNodeId) {
          const telemetry = STAGE_TELEMETRY[stage];
          const history = STAGE_SENSOR_HISTORIES[stage];
          return {
            ...s,
            soilMoisturePct: telemetry.soilMoisturePct,
            slopeTiltDeg: telemetry.slopeTiltDeg,
            porePressureKPa: telemetry.porePressureKPa,
            status: (telemetry.sensorStatus === 'ONLINE' ? 'ONLINE' : 'WARNING') as SensorReading['status'],
            history
          };
        }
        return s;
      })
    );

    // Update satellite displacement for targeted zone
    setSatellite((prev) => {
      const telemetry = STAGE_TELEMETRY[stage];
      return {
        ...prev,
        surfaceMotionMm: telemetry.surfaceMotionMm,
        displacementStatus: telemetry.displacementStatus as SatelliteObservation['displacementStatus']
      };
    });

    // Update Roads Segment status dynamically
    setRoads((prev) =>
      prev.map((r) => {
        if (r.connectedZones.includes(targetZoneCode)) {
          const telemetry = STAGE_TELEMETRY[stage];
          return {
            ...r,
            status: telemetry.roadStatus
          };
        }
        return r;
      })
    );

    // Run Early-Warning Decision Engine for active stage telemetry
    const stageTelemetry = STAGE_TELEMETRY[stage];
    const stageWeather = STAGE_WEATHER[stage];
    const decisionResult = evaluateEarlyWarning({
      zoneCode: targetZoneCode,
      rainfallRateMmHr: stageWeather.rainfallRateMmHr,
      accumulation24hMm: stageWeather.accumulation24hMm,
      soilMoisturePct: stageTelemetry.soilMoisturePct,
      porePressureKPa: stageTelemetry.porePressureKPa,
      slopeTiltDeg: stageTelemetry.slopeTiltDeg,
      insarDisplacementMm: stageTelemetry.insarDisplacementMm,
      slopeInstabilityPct: stageTelemetry.slopeInstabilityPct,
      roadStatus: stageTelemetry.roadStatus,
      stage: stage,
    });

    setEarlyWarningResult(decisionResult);

    // Dynamically Filter & Update Alerts using Decision Engine Outputs
    setAlerts((prev) => {
      let updatedAlerts = [...initialAlerts];
      if (stage === 1) {
        updatedAlerts = updatedAlerts.filter((a) => a.zoneCode !== targetZoneCode);
      } else {
        const hasExisting = updatedAlerts.some((a) => a.zoneCode === targetZoneCode);
        if (decisionResult.level === 'CRITICAL') {
          playAlertChime();
        }

        if (hasExisting) {
          updatedAlerts = updatedAlerts.map((a) => {
            if (a.zoneCode === targetZoneCode) {
              let headline = `${decisionResult.level} EARLY WARNING: Multi-Factor Threat at ${targetZoneCode}`;
              let acknowledged = false;
              let status: Alert['status'] = decisionResult.level === 'CRITICAL' ? 'DISPATCHED' : decisionResult.level === 'HIGH' ? 'DISPATCHED' : 'PENDING REVIEW';

              if (stage === 6) {
                headline = `RECOVERY ALERT: Stabilization & De-escalation In Progress at ${targetZoneCode}`;
                status = 'DISPATCHED';
                acknowledged = true;
              }

              return {
                ...a,
                severity: decisionResult.level,
                headline,
                summary: decisionResult.reasons.join(". "),
                contributingTriggers: decisionResult.contributingTriggers,
                acknowledged,
                status,
                riskScore: decisionResult.riskScore
              };
            }
            return a;
          });
        } else {
          updatedAlerts.unshift({
            id: `alt-${Date.now()}`,
            alertCode: `ALT-${new Date().getFullYear()}-${targetZoneCode.replace('-', '')}`,
            severity: decisionResult.level,
            zoneCode: targetZoneCode,
            locationName: decisionResult.affectedZoneName,
            district: decisionResult.district,
            state: decisionResult.state,
            riskScore: decisionResult.riskScore,
            headline: `${decisionResult.level} EARLY WARNING: Multi-Factor Threat at ${targetZoneCode}`,
            summary: decisionResult.reasons.join(". "),
            timestamp: decisionResult.timestamp,
            minutesAgo: 0,
            contributingTriggers: decisionResult.contributingTriggers,
            threatenedCorridor: stageTelemetry.roadStatus === 'BLOCKED' ? 'NH-54 Escarpment Corridor (BLOCKED)' : 'Arterial Transport Link',
            status: decisionResult.level === 'CRITICAL' ? 'DISPATCHED' : 'PENDING REVIEW',
            dispatchedTo: ['DDMA Incident Commander', 'SDRF Emergency Roster'],
            acknowledged: false
          });
        }
      }
      return updatedAlerts;
    });

    // Dynamically update Emergency Priorities based on risk scores
    setEmergencyPriorities((prev) => {
      return initialEmergencyPriorities.map((ep) => {
        if (ep.zoneCode === targetZoneCode) {
          const telemetry = STAGE_TELEMETRY[stage];
          const weatherData = STAGE_WEATHER[stage];
          const calc = calculateRisk({
            rainfallRateMmHr: weatherData.rainfallRateMmHr,
            accumulation24hMm: weatherData.accumulation24hMm,
            soilMoisturePct: telemetry.soilMoisturePct,
            porePressureKPa: telemetry.porePressureKPa,
            slopeInstabilityPct: telemetry.slopeInstabilityPct,
            insarDisplacementMm: telemetry.insarDisplacementMm,
            historicalVulnerabilityPct: 88,
            slopeAngleDeg: 48
          });

          let evacuationStatus = ep.evacuationStatus;
          let status = 'STANDBY';
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
            riskScore: calc.score,
            severity: calc.severity,
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

  // Initial stage calculation on mount
  useEffect(() => {
    applyStageData(demoStage);
  }, [applyStageData]);

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
    const timer = setTimeout(() => {
      const next = (demoStage >= 6 ? 1 : ((demoStage + 1) as DemoStage));
      applyStageData(next);
    }, simulationSpeedMs);
    return () => clearTimeout(timer);
  }, [isAutoPlaying, demoStage, simulationSpeedMs, applyStageData]);
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
        refreshBackendData,
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
        toggleAudioWarning,
        earlyWarningResult
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
