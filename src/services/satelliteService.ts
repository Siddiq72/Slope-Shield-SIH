/**
 * Slope Shield Satellite & InSAR Remote Sensing Service (Phase 2: API Driven with Controlled Fallback)
 * 
 * Provides Synthetic Aperture Radar (SAR) interferometry and Line-of-Sight (LOS)
 * surface displacement telemetry from backend REST endpoints (/api/satellite/:zoneCode and /api/satellite/insar)
 * with robust offline/demo fallback.
 */

import { apiClient } from './api/apiClient';

export interface InSARMetrics {
  satellite: string;
  orbitPass: string;
  lastPassTimestamp: string;
  losDisplacementMmPerYear: number;
  temporalCoherence: number;
  phaseInterferometryConfidence: string;
  unstableAreaSqKm: number;
  criticalAnomaliesDetected: number;
  source: 'simulated-copernicus-insar' | 'live-satellite-feed' | 'backend-satellite-service';
}

export interface SatelliteProvider {
  getZoneInSAR(zoneCode: string): Promise<InSARMetrics>;
  getOrbitalPassSchedule(): Promise<Array<{ satellite: string; passDate: string; direction: string }>>;
}

class IntegratedSatelliteService implements SatelliteProvider {
  async getZoneInSAR(zoneCode: string): Promise<InSARMetrics> {
    try {
      const res = await apiClient.get<InSARMetrics>(`/satellite/${zoneCode}`);
      return res.data;
    } catch (err) {
      // Fallback
      const displacementMap: Record<string, number> = {
        'N-07': -28.4,
        'N-03': -21.8,
        'N-11': -14.2,
        'N-14': -9.5,
        'N-02': -5.1,
      };

      return {
        satellite: 'Sentinel-1A (C-Band SAR)',
        orbitPass: 'Ascending Track 142',
        lastPassTimestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        losDisplacementMmPerYear: displacementMap[zoneCode] ?? -8.0,
        temporalCoherence: 0.88,
        phaseInterferometryConfidence: '94.2%',
        unstableAreaSqKm: 3.42,
        criticalAnomaliesDetected: zoneCode === 'N-07' || zoneCode === 'N-03' ? 4 : 1,
        source: 'simulated-copernicus-insar',
      };
    }
  }

  async getOrbitalPassSchedule(): Promise<Array<{ satellite: string; passDate: string; direction: string }>> {
    return [
      { satellite: 'Sentinel-1A', passDate: 'In 3 days', direction: 'Descending Track 69' },
      { satellite: 'Sentinel-1C', passDate: 'In 6 days', direction: 'Ascending Track 142' },
      { satellite: 'NISAR (L+S Band)', passDate: 'In 9 days', direction: 'Ascending Track 12' },
    ];
  }
}

export const satelliteService = new IntegratedSatelliteService();
