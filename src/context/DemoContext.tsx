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

export type DemoStage = 1 | 2 | 3 | 4 | 5;

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
  5: 'Stage 5: CRITICAL Alert Generated & DDMA Dispatch'
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
    
    // Scale Zone N-07 and other telemetry according to stage
    if (stage === 1) {
      // Normal baseline
      setZones((prev) =>
        prev.map((z) => {
          if (z.code === 'N-07') {
            return {
              ...z,
              riskScore: 38,
              riskLevel: 'LOW' as RiskLevel,
              rainfallRateMmHr: 4,
              accumulation24hMm: 16,
              soilMoisturePct: 34,
              porePressureKPa: 14.2,
              insarDisplacementMm: 0.6,
              slopeInstabilityPct: 28,
              roadStatus: 'OPEN',
              forecast6h: {
                from: 'LOW',
                to: 'LOW',
                projectedScore: 42,
                trend: 'STABLE'
              }
            };
          }
          return z;
        })
      );
      setWeather((prev) => ({
        ...prev,
        rainfallRateMmHr: 4,
        accumulation24hMm: 16,
        intensityLabel: 'NORMAL',
        trend: 'STABLE'
      }));
      setSensors((prev) =>
        prev.map((s) => (s.nodeId === 'SN-07A' ? { ...s, soilMoisturePct: 34, slopeTiltDeg: 0.9, porePressureKPa: 14.2, status: 'ONLINE' } : s))
      );
    } else if (stage === 2) {
      // Rain increasing
      setZones((prev) =>
        prev.map((z) => {
          if (z.code === 'N-07') {
            return {
              ...z,
              riskScore: 58,
              riskLevel: 'MODERATE' as RiskLevel,
              rainfallRateMmHr: 22,
              accumulation24hMm: 52,
              soilMoisturePct: 48,
              porePressureKPa: 26.5,
              insarDisplacementMm: 1.8,
              slopeInstabilityPct: 49,
              roadStatus: 'OPEN',
              forecast6h: {
                from: 'MODERATE',
                to: 'HIGH',
                projectedScore: 72,
                trend: 'INCREASING'
              }
            };
          }
          return z;
        })
      );
      setWeather((prev) => ({
        ...prev,
        rainfallRateMmHr: 22,
        accumulation24hMm: 52,
        intensityLabel: 'MODERATE RAIN',
        trend: 'INCREASING'
      }));
      setSensors((prev) =>
        prev.map((s) => (s.nodeId === 'SN-07A' ? { ...s, soilMoisturePct: 48, slopeTiltDeg: 1.8, porePressureKPa: 26.5, status: 'ONLINE' } : s))
      );
    } else if (stage === 3) {
      // Soil saturation climbing
      setZones((prev) =>
        prev.map((z) => {
          if (z.code === 'N-07') {
            return {
              ...z,
              riskScore: 76,
              riskLevel: 'HIGH' as RiskLevel,
              rainfallRateMmHr: 34,
              accumulation24hMm: 86,
              soilMoisturePct: 62,
              porePressureKPa: 42.0,
              insarDisplacementMm: 4.1,
              slopeInstabilityPct: 68,
              roadStatus: 'AT RISK',
              forecast6h: {
                from: 'HIGH',
                to: 'CRITICAL',
                projectedScore: 88,
                trend: 'INCREASING'
              }
            };
          }
          return z;
        })
      );
      setWeather((prev) => ({
        ...prev,
        rainfallRateMmHr: 34,
        accumulation24hMm: 86,
        intensityLabel: 'HEAVY DOWNPOUR',
        trend: 'INCREASING'
      }));
      setSensors((prev) =>
        prev.map((s) => (s.nodeId === 'SN-07A' ? { ...s, soilMoisturePct: 62, slopeTiltDeg: 3.4, porePressureKPa: 42.0, status: 'WARNING' } : s))
      );
    } else if (stage === 4) {
      // Slope instability high
      setZones((prev) =>
        prev.map((z) => {
          if (z.code === 'N-07') {
            return {
              ...z,
              riskScore: 86,
              riskLevel: 'HIGH' as RiskLevel,
              rainfallRateMmHr: 40,
              accumulation24hMm: 104,
              soilMoisturePct: 70,
              porePressureKPa: 52.6,
              insarDisplacementMm: 6.8,
              slopeInstabilityPct: 76,
              roadStatus: 'AT RISK',
              forecast6h: {
                from: 'HIGH',
                to: 'CRITICAL',
                projectedScore: 94,
                trend: 'INCREASING'
              }
            };
          }
          return z;
        })
      );
      setWeather((prev) => ({
        ...prev,
        rainfallRateMmHr: 40,
        accumulation24hMm: 104,
        intensityLabel: 'HEAVY DOWNPOUR',
        trend: 'INCREASING'
      }));
      setSensors((prev) =>
        prev.map((s) => (s.nodeId === 'SN-07A' ? { ...s, soilMoisturePct: 70, slopeTiltDeg: 4.7, porePressureKPa: 52.6, status: 'WARNING' } : s))
      );
    } else if (stage === 5) {
      // CRITICAL stage (92+)
      setZones(initialRiskZones);
      setWeather(initialWeatherReading);
      setSensors(initialSensors);
      setSatellite(initialSatelliteObservation);
      setRoads(initialRoadSegments);
      setAlerts(initialAlerts);
      setEmergencyPriorities(initialEmergencyPriorities);
      playAlertChime();
    }
  }, [playAlertChime]);

  const nextDemoStage = () => {
    const next = (demoStage >= 5 ? 1 : ((demoStage + 1) as DemoStage));
    applyStageData(next);
  };

  const prevDemoStage = () => {
    const prev = (demoStage <= 1 ? 5 : ((demoStage - 1) as DemoStage));
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
        const next = (current >= 5 ? 1 : ((current + 1) as DemoStage));
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

  return (
    <DemoContext.Provider
      value={{
        zones,
        selectedZoneCode,
        selectedZone,
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
