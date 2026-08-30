import { apiClient, ApiResponse } from './apiClient';
import { RiskZone, RiskAnalysisExplainability } from '../../types';
import { initialRiskZones, initialRiskAnalysisN07 } from '../../data/demoData';

export interface SimulateRiskParams {
  zoneCode: string;
  rainfallRateMmHr: number;
  soilMoisturePct: number;
  tiltRateDeg: number;
}

export interface SimulateRiskResult {
  simulatedRiskScore: number;
  simulatedSeverity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  factorOfSafety: number;
  ruptureHorizonHours: number;
  advisory: string;
}

export interface RiskHistoryItem {
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
}

export const riskService = {
  async getRiskHistory(zoneCode: string): Promise<ApiResponse<RiskHistoryItem[]>> {
    try {
      const res = await apiClient.get<RiskHistoryItem[]>(`/risk-history/${zoneCode}`);
      return res;
    } catch (err) {
      console.warn(`Risk history API unavailable for ${zoneCode}, using fallback:`, err);
      const fallbackHistory: RiskHistoryItem[] = [
        {
          id: 'ra-1',
          zoneCode,
          timestamp: 'T-16h (06:00)',
          riskScore: 42,
          severity: 'LOW',
          rainfallContribution: 0.20,
          soilMoistureContribution: 0.20,
          slopeContribution: 0.30,
          factorOfSafety: 1.85,
          predictionHorizon: '6h',
          advisory: 'Normal antecedent baseline conditions.'
        },
        {
          id: 'ra-2',
          zoneCode,
          timestamp: 'T-10h (10:00)',
          riskScore: 63,
          severity: 'MODERATE',
          rainfallContribution: 0.30,
          soilMoistureContribution: 0.25,
          slopeContribution: 0.25,
          factorOfSafety: 1.45,
          predictionHorizon: '6h',
          advisory: 'Monsoon surge initiates subsurface moisture infiltration.'
        },
        {
          id: 'ra-3',
          zoneCode,
          timestamp: 'T-4h (14:00)',
          riskScore: 78,
          severity: 'HIGH',
          rainfallContribution: 0.35,
          soilMoistureContribution: 0.30,
          slopeContribution: 0.20,
          factorOfSafety: 1.15,
          predictionHorizon: '6h',
          advisory: 'Accelerated creep and pore pressure spike.'
        },
        {
          id: 'ra-4',
          zoneCode,
          timestamp: 'T-0h (18:00)',
          riskScore: 92,
          severity: 'CRITICAL',
          rainfallContribution: 0.35,
          soilMoistureContribution: 0.25,
          slopeContribution: 0.20,
          factorOfSafety: 0.76,
          predictionHorizon: '6h',
          advisory: 'Active shear bedding plane failure. Immediate evacuation protocol warranted.'
        }
      ];
      return {
        data: fallbackHistory,
        status: 200,
        message: 'Demo fallback historical risk progression',
        timestamp: new Date().toISOString(),
        source: 'DEMO_FALLBACK'
      };
    }
  },

  async getAllZones(): Promise<ApiResponse<RiskZone[]>> {
    try {
      const res = await apiClient.get<RiskZone[]>('/risk-zones');
      return res;
    } catch (err) {
      console.warn('Risk zones API unavailable, using demo fallback:', err);
      return {
        data: [...initialRiskZones],
        status: 200,
        message: 'Demo fallback zones',
        timestamp: new Date().toISOString(),
        source: 'DEMO_FALLBACK',
      };
    }
  },

  async getZoneByCode(code: string): Promise<ApiResponse<RiskZone>> {
    try {
      const res = await apiClient.get<RiskZone>(`/risk-zones/${code}`);
      return res;
    } catch (err) {
      console.warn(`Zone ${code} API unavailable, using fallback:`, err);
      const zone = initialRiskZones.find((z) => z.code.toLowerCase() === code.toLowerCase()) || initialRiskZones[0];
      return {
        data: zone,
        status: 200,
        message: 'Demo fallback zone',
        timestamp: new Date().toISOString(),
        source: 'DEMO_FALLBACK',
      };
    }
  },

  async getRiskAnalysis(zoneCode: string): Promise<ApiResponse<RiskAnalysisExplainability>> {
    try {
      const res = await apiClient.get<RiskAnalysisExplainability>(`/risk-analysis/${zoneCode}`);
      return res;
    } catch (err) {
      console.warn(`Risk analysis API unavailable for ${zoneCode}, using PINN fallback:`, err);
      if (zoneCode === 'N-07') {
        return {
          data: initialRiskAnalysisN07,
          status: 200,
          message: 'Demo fallback explainability',
          timestamp: new Date().toISOString(),
          source: 'DEMO_FALLBACK',
        };
      }
      const baseZone = initialRiskZones.find((z) => z.code === zoneCode) || initialRiskZones[0];
      const explainability: RiskAnalysisExplainability = {
        zoneCode: baseZone.code,
        zoneName: `${baseZone.name} (${baseZone.district})`,
        currentRiskScore: baseZone.riskScore,
        severity: baseZone.riskLevel,
        aiConfidencePct: Math.min(96, Math.max(78, 85 + (baseZone.riskScore > 80 ? 8 : 0))),
        modelEngine: 'SlopeShield Multi-Source Hybrid: XGBoost + Physics-Informed Geomechanical Network (PINN)',
        contributors: {
          rainfall: {
            weight: 0.35,
            valuePct: Math.min(100, Math.round(baseZone.rainfallRateMmHr * 1.8 + baseZone.accumulation24hMm * 0.3)),
            rawValue: `${baseZone.rainfallRateMmHr} mm/hr (${baseZone.accumulation24hMm}mm/24h)`,
            status: baseZone.rainfallRateMmHr > 35 ? 'Critical Threshold Exceeded' : 'Elevated Monsoonal Inflow'
          },
          soilMoisture: {
            weight: 0.25,
            valuePct: baseZone.soilMoisturePct,
            rawValue: `${baseZone.soilMoisturePct}% volumetric moisture`,
            status: baseZone.soilMoisturePct > 70 ? 'High Capillary Saturation' : 'Moderate Saturation'
          },
          slopeInstability: {
            weight: 0.20,
            valuePct: baseZone.slopeInstabilityPct,
            rawValue: `${baseZone.slopeAngleDeg}° slope gradient`,
            status: baseZone.slopeInstabilityPct > 75 ? 'Active Shear Plane Strain' : 'Nominal Stability'
          },
          historical: {
            weight: 0.10,
            valuePct: baseZone.historicalVulnerabilityPct,
            rawValue: `${baseZone.historicalVulnerabilityPct}% Vulnerability Index`,
            status: 'Regional Landslide Inventory Match'
          },
          insarDeformation: {
            weight: 0.10,
            valuePct: Math.min(100, Math.round(baseZone.insarDisplacementMm * 9)),
            rawValue: `+${baseZone.insarDisplacementMm} mm surface motion`,
            status: 'Sentinel-1 InSAR Deformation Stream'
          }
        },
        temporalProjection: [
          { hoursAhead: 0, riskScore: baseZone.riskScore, rainfallIntensity: baseZone.rainfallRateMmHr, soilSaturation: baseZone.soilMoisturePct, confidence: 94 },
          { hoursAhead: 2, riskScore: Math.min(99, Math.round(baseZone.riskScore * 1.04)), rainfallIntensity: Math.round(baseZone.rainfallRateMmHr * 1.1), soilSaturation: Math.min(98, baseZone.soilMoisturePct + 4), confidence: 91 },
          { hoursAhead: 4, riskScore: Math.min(99, Math.round(baseZone.riskScore * 1.06)), rainfallIntensity: Math.round(baseZone.rainfallRateMmHr * 1.15), soilSaturation: Math.min(98, baseZone.soilMoisturePct + 7), confidence: 88 },
          { hoursAhead: 6, riskScore: baseZone.forecast6h.projectedScore, rainfallIntensity: Math.round(baseZone.rainfallRateMmHr * 0.9), soilSaturation: Math.min(98, baseZone.soilMoisturePct + 8), confidence: 85 }
        ],
        falseAlarmSuppressionMetrics: {
          antecedentSoilMoistureIndex: Number((baseZone.soilMoisturePct / 100).toFixed(2)),
          vegetationIndexNDVI: 0.45,
          geologicalFrictionAngle: Number((32 - baseZone.slopeAngleDeg * 0.15).toFixed(1)),
          crossValidationScore: 0.958,
          historicalCorrelationMatch: `88.5% pattern match for ${baseZone.district} geomorphology`
        },
        whyThisScore: [
          `Precipitation rate of ${baseZone.rainfallRateMmHr} mm/hr with 24h accumulation of ${baseZone.accumulation24hMm}mm exceeds regional stability envelope.`,
          `Subsurface pore water pressure (${baseZone.porePressureKPa} kPa) significantly reduces effective normal stress along the slip interface.`,
          `Slope angle of ${baseZone.slopeAngleDeg}° in weak fractured lithology provides high gravitational shear impetus.`,
          `Historical landslide recurrence in ${baseZone.district} correlates with current antecedent moisture profile.`
        ]
      };
      return {
        data: explainability,
        status: 200,
        message: 'Demo fallback explainability',
        timestamp: new Date().toISOString(),
        source: 'DEMO_FALLBACK',
      };
    }
  },

  async simulateParametricScenario(params: SimulateRiskParams): Promise<ApiResponse<SimulateRiskResult>> {
    try {
      const res = await apiClient.post<SimulateRiskResult>('/risk-analysis/simulate', params);
      return res;
    } catch (err) {
      console.warn('Simulation API unavailable, computing locally:', err);
      const score = Math.min(
        99,
        Math.max(
          15,
          Math.round(
            params.rainfallRateMmHr * 0.9 +
            params.soilMoisturePct * 0.45 +
            params.tiltRateDeg * 4.2 +
            10
          )
        )
      );
      const severity = score >= 85 ? 'CRITICAL' : score >= 70 ? 'HIGH' : score >= 45 ? 'MODERATE' : 'LOW';
      return {
        data: {
          simulatedRiskScore: score,
          simulatedSeverity: severity,
          factorOfSafety: Number((1.85 - (score / 100) * 1.1).toFixed(2)),
          ruptureHorizonHours: score >= 85 ? 2.5 : score >= 70 ? 5.0 : 12.0,
          advisory: score >= 85
            ? 'Catastrophic slope failure trigger predicted. Immediate evacuation protocol warranted.'
            : score >= 70
            ? 'High risk alert generated. Road transit restriction recommended.'
            : 'Slope remains within safe structural factor of safety envelope.',
        },
        status: 200,
        message: 'Local PINN simulation output',
        timestamp: new Date().toISOString(),
        source: 'DEMO_FALLBACK',
      };
    }
  },
};
