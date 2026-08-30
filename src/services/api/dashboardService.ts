import { apiClient, ApiResponse } from './apiClient';
import { 
  RiskZone, 
  SensorReading, 
  WeatherReading, 
  SatelliteObservation, 
  RoadSegment, 
  Alert, 
  EmergencyPriority 
} from '../../types';
import { 
  initialRiskZones, 
  initialSensors, 
  initialWeatherReading, 
  initialSatelliteObservation, 
  initialRoadSegments, 
  initialAlerts, 
  initialEmergencyPriorities 
} from '../../data/demoData';

export interface DashboardCompositeData {
  metrics: {
    totalMonitored: number;
    highRiskCount: number;
    criticalCount: number;
    activeAlertsCount: number;
  };
  zones: RiskZone[];
  sensors: SensorReading[];
  weather: WeatherReading;
  satellite: SatelliteObservation;
  roads: RoadSegment[];
  alerts: Alert[];
  emergencyPriorities: EmergencyPriority[];
  timestamp: string;
}

export const dashboardService = {
  async getDashboard(): Promise<ApiResponse<DashboardCompositeData>> {
    try {
      const res = await apiClient.get<DashboardCompositeData>('/dashboard');
      return res;
    } catch (err) {
      console.warn('Dashboard API unavailable, falling back to local dataset:', err);
      // Controlled Hackathon Demo Fallback
      return {
        data: {
          metrics: {
            totalMonitored: 57,
            highRiskCount: initialRiskZones.filter(z => z.riskLevel === 'HIGH').length + 8,
            criticalCount: initialRiskZones.filter(z => z.riskLevel === 'CRITICAL').length,
            activeAlertsCount: initialAlerts.length + 3,
          },
          zones: initialRiskZones,
          sensors: initialSensors,
          weather: initialWeatherReading,
          satellite: initialSatelliteObservation,
          roads: initialRoadSegments,
          alerts: initialAlerts,
          emergencyPriorities: initialEmergencyPriorities,
          timestamp: new Date().toISOString(),
        },
        status: 200,
        message: 'Loaded from local demo fallback dataset',
        timestamp: new Date().toISOString(),
        source: 'DEMO_FALLBACK',
      };
    }
  },
};
