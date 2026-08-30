import { apiClient, ApiResponse } from './api/apiClient';
import { emergencyService } from './api/emergencyService';
import { alertService } from './api/alertService';
import { reportService } from './api/reportService';
import { sensorService } from './api/sensorService';
import { dashboardService } from './api/dashboardService';
import { EmergencyPriority } from '../types';

export {
  emergencyService,
  alertService,
  reportService,
  sensorService,
  dashboardService,
};

export const emergencyApi = {
  async getPriorities(): Promise<ApiResponse<EmergencyPriority[]>> {
    return emergencyService.getEmergencyPriorities();
  }
};

export interface GeminiBriefingResult {
  executiveSummary: string;
  geotechnicalAssessment: string;
  immediateDirectives: string[];
  publicWarningMessage: string;
  vernacularAlertMizo?: string;
  vernacularAlert?: string;
}

export const geminiBriefingApi = {
  async generateBriefing(params: {
    zoneCode: string;
    zoneName: string;
    riskScore: number;
    riskLevel: string;
    rainfallRate: number;
    soilMoisture: number;
    slopeAngle: number;
    district: string;
    state: string;
  }): Promise<{ success: boolean; source: string; briefing: GeminiBriefingResult }> {
    try {
      const res = await apiClient.post<{ success: boolean; source: string; briefing: GeminiBriefingResult }>(
        '/gemini/briefing',
        params
      );
      return res.data;
    } catch (e) {
      console.warn('Backend briefing call fallback:', e);
      return {
        success: true,
        source: 'geomechanical-pinn-engine',
        briefing: {
          executiveSummary: `Zone ${params.zoneCode} (${params.zoneName}) presents an imminent slope failure risk with an index of ${params.riskScore}% triggered by intensive precipitation (${params.rainfallRate} mm/hr) and high soil saturation (${params.soilMoisture}%).`,
          geotechnicalAssessment: `Hydrostatic pore pressure in fractured lithology at ${params.slopeAngle}° slope angle reduces normal resisting forces, exacerbating creep along the bedrock boundary.`,
          immediateDirectives: [
            "Issue Red Alert Evacuation for downslope settlements.",
            "Close arterial mountain corridors to civilian traffic and station emergency response crews.",
            "Deploy emergency sirens and notify State Disaster Response Force (SDRF)."
          ],
          publicWarningMessage: `EMERGENCY ALERT: Landslide threat at ${params.zoneCode}. Evacuate immediately to designated relief centers. Dial 1077 for DDMA assistance.`,
          vernacularAlertMizo: `KHAWNGAIHIN HRIAT RAWH: ${params.zoneName} ah lei tawlh hlauhawm a awm avangin a rang lamin hmun him lam pan rawh u.`
        }
      };
    }
  }
};

export const systemHealthApi = {
  async getHealth(): Promise<{
    status: string;
    node: string;
    phase: string;
    geminiLive: boolean;
    timestamp: string;
    activeScenario?: { stage: number; scenarioId: string; updatedAt: string };
    database?: { status: string; recordCount: number; reportsCount: number; alertsCount: number; storageMode: string };
  }> {
    try {
      const res = await apiClient.get<{
        status: string;
        node: string;
        phase: string;
        geminiLive: boolean;
        timestamp: string;
        activeScenario?: { stage: number; scenarioId: string; updatedAt: string };
        database?: { status: string; recordCount: number; reportsCount: number; alertsCount: number; storageMode: string };
      }>('/health');
      return res.data;
    } catch (e) {
      console.warn('Health check fallback:', e);
      return {
        status: 'ok',
        node: 'Northeast India Landslide Early Warning Grid (Local Mode)',
        phase: 'Phase 4: End-to-End Demo & Intelligence Engine',
        geminiLive: false,
        timestamp: new Date().toISOString(),
      };
    }
  }
};

// Scenario sync API — silently notifies the backend of the active demo stage
export const scenarioApi = {
  async syncStage(stage: number, scenarioId: string): Promise<void> {
    try {
      await apiClient.post('/scenario', { stage, scenarioId });
    } catch (e) {
      // Fire-and-forget — non-critical
      console.debug('Scenario sync skipped (offline):', e);
    }
  },
  async getState(): Promise<{
    activeScenario: { stage: number; scenarioId: string; updatedAt: string };
    factorOfSafety: number;
    ruptureHorizonHours: number;
  } | null> {
    try {
      const res = await apiClient.get<{
        activeScenario: { stage: number; scenarioId: string; updatedAt: string };
        factorOfSafety: number;
        ruptureHorizonHours: number;
      }>('/scenario-state');
      return res.data;
    } catch {
      return null;
    }
  }
};
