/**
 * Canonical Stage Maps — Single Source of Truth
 *
 * All demo simulation stage data is defined here and imported by:
 * - server.ts
 * - server/database/dbStore.ts
 * - src/context/DemoContext.tsx
 *
 * Do NOT duplicate these values elsewhere.
 */

export interface StageWeather {
  rainfallRateMmHr: number;
  accumulation24hMm: number;
  intensityLabel: string;
  trend: string;
  humidityPct: number;
}

export interface StageTelemetry {
  soilMoisturePct: number;
  porePressureKPa: number;
  insarDisplacementMm: number;
  slopeInstabilityPct: number;
  roadStatus: 'OPEN' | 'AT RISK' | 'BLOCKED';
  recommendedAction: string;
  slopeTiltDeg: number;
  sensorStatus: 'ONLINE' | 'WARNING';
  forecastTrend: 'INCREASING' | 'STABLE' | 'DECREASING';
  forecastTo: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  surfaceMotionMm: number;
  displacementStatus: 'STABLE' | 'DISPLACEMENT DETECTED' | 'ELEVATED VELOCITY';
}

export type SensorHistoryEntry = {
  timestamp: string;
  soilMoisture: number;
  tilt: number;
  porePressure: number;
};

export const STAGE_WEATHER: Record<number, StageWeather> = {
  1: { rainfallRateMmHr: 4,    accumulation24hMm: 16,    intensityLabel: 'NORMAL',           trend: 'STABLE',     humidityPct: 72 },
  2: { rainfallRateMmHr: 22,   accumulation24hMm: 52,    intensityLabel: 'MODERATE RAIN',     trend: 'INCREASING', humidityPct: 82 },
  3: { rainfallRateMmHr: 34,   accumulation24hMm: 86,    intensityLabel: 'HEAVY DOWNPOUR',    trend: 'INCREASING', humidityPct: 90 },
  4: { rainfallRateMmHr: 40,   accumulation24hMm: 104,   intensityLabel: 'HEAVY DOWNPOUR',    trend: 'INCREASING', humidityPct: 93 },
  5: { rainfallRateMmHr: 42.5, accumulation24hMm: 168.4, intensityLabel: 'TORRENTIAL MONSOON', trend: 'INCREASING', humidityPct: 95 },
  6: { rainfallRateMmHr: 5,    accumulation24hMm: 120,   intensityLabel: 'NORMAL',           trend: 'DECREASING', humidityPct: 75 },
};

export const STAGE_TELEMETRY: Record<number, StageTelemetry> = {
  1: { soilMoisturePct: 34, porePressureKPa: 14.2, insarDisplacementMm: -0.6,  slopeInstabilityPct: 28, roadStatus: 'OPEN',     recommendedAction: 'Routine automated telemetry polling. Visual spot-checks.',                     slopeTiltDeg: 0.9, sensorStatus: 'ONLINE',  forecastTrend: 'STABLE',     forecastTo: 'LOW',      surfaceMotionMm: -0.6,  displacementStatus: 'STABLE' },
  2: { soilMoisturePct: 48, porePressureKPa: 26.5, insarDisplacementMm: -1.8,  slopeInstabilityPct: 49, roadStatus: 'OPEN',     recommendedAction: 'Monitor drainage channels and road shoulder cracks.',                         slopeTiltDeg: 1.8, sensorStatus: 'ONLINE',  forecastTrend: 'INCREASING', forecastTo: 'HIGH',     surfaceMotionMm: -1.8,  displacementStatus: 'STABLE' },
  3: { soilMoisturePct: 62, porePressureKPa: 42.0, insarDisplacementMm: -4.1,  slopeInstabilityPct: 68, roadStatus: 'AT RISK',  recommendedAction: 'Pre-position emergency clearing equipment. Regulate traffic.',                 slopeTiltDeg: 3.4, sensorStatus: 'WARNING', forecastTrend: 'INCREASING', forecastTo: 'CRITICAL', surfaceMotionMm: -4.1,  displacementStatus: 'DISPLACEMENT DETECTED' },
  4: { soilMoisturePct: 70, porePressureKPa: 52.6, insarDisplacementMm: -6.8,  slopeInstabilityPct: 76, roadStatus: 'AT RISK',  recommendedAction: 'Deploy response units on standby. Restrict heavy traffic.',                    slopeTiltDeg: 4.7, sensorStatus: 'WARNING', forecastTrend: 'INCREASING', forecastTo: 'CRITICAL', surfaceMotionMm: -6.8,  displacementStatus: 'DISPLACEMENT DETECTED' },
  5: { soilMoisturePct: 84, porePressureKPa: 58.4, insarDisplacementMm: -28.4, slopeInstabilityPct: 91, roadStatus: 'BLOCKED',  recommendedAction: 'Execute Pre-Emptive Evacuation Order for Downslope Settlements.',              slopeTiltDeg: 5.6, sensorStatus: 'WARNING', forecastTrend: 'INCREASING', forecastTo: 'CRITICAL', surfaceMotionMm: -28.4, displacementStatus: 'ELEVATED VELOCITY' },
  6: { soilMoisturePct: 55, porePressureKPa: 28.0, insarDisplacementMm: -28.8, slopeInstabilityPct: 45, roadStatus: 'OPEN',     recommendedAction: 'PWD debris clearance complete. Residents return under monitoring.',             slopeTiltDeg: 5.7, sensorStatus: 'ONLINE',  forecastTrend: 'DECREASING', forecastTo: 'LOW',      surfaceMotionMm: -28.8, displacementStatus: 'STABLE' },
};

export const STAGE_SENSOR_HISTORIES: Record<number, SensorHistoryEntry[]> = {
  1: [
    { timestamp: '10:00', soilMoisture: 30, tilt: 0.8, porePressure: 12 },
    { timestamp: '11:00', soilMoisture: 31, tilt: 0.8, porePressure: 12.5 },
    { timestamp: '12:00', soilMoisture: 32, tilt: 0.9, porePressure: 13 },
    { timestamp: '13:00', soilMoisture: 33, tilt: 0.9, porePressure: 13.5 },
    { timestamp: '14:00', soilMoisture: 34, tilt: 0.9, porePressure: 14.2 }
  ],
  2: [
    { timestamp: '10:00', soilMoisture: 34, tilt: 0.9, porePressure: 14.2 },
    { timestamp: '11:00', soilMoisture: 38, tilt: 1.1, porePressure: 17 },
    { timestamp: '12:00', soilMoisture: 41, tilt: 1.3, porePressure: 20 },
    { timestamp: '13:00', soilMoisture: 45, tilt: 1.6, porePressure: 23.5 },
    { timestamp: '14:00', soilMoisture: 48, tilt: 1.8, porePressure: 26.5 }
  ],
  3: [
    { timestamp: '10:00', soilMoisture: 48, tilt: 1.8, porePressure: 26.5 },
    { timestamp: '11:00', soilMoisture: 52, tilt: 2.2, porePressure: 31 },
    { timestamp: '12:00', soilMoisture: 55, tilt: 2.6, porePressure: 35 },
    { timestamp: '13:00', soilMoisture: 58, tilt: 3.0, porePressure: 38.5 },
    { timestamp: '14:00', soilMoisture: 62, tilt: 3.4, porePressure: 42.0 }
  ],
  4: [
    { timestamp: '10:00', soilMoisture: 62, tilt: 3.4, porePressure: 42.0 },
    { timestamp: '11:00', soilMoisture: 64, tilt: 3.7, porePressure: 45 },
    { timestamp: '12:00', soilMoisture: 66, tilt: 4.0, porePressure: 48 },
    { timestamp: '13:00', soilMoisture: 68, tilt: 4.4, porePressure: 50.5 },
    { timestamp: '14:00', soilMoisture: 70, tilt: 4.7, porePressure: 52.6 }
  ],
  5: [
    { timestamp: '10:00', soilMoisture: 70, tilt: 4.7, porePressure: 52.6 },
    { timestamp: '11:00', soilMoisture: 73, tilt: 5.0, porePressure: 54.5 },
    { timestamp: '12:00', soilMoisture: 76, tilt: 5.2, porePressure: 56 },
    { timestamp: '13:00', soilMoisture: 80, tilt: 5.4, porePressure: 57.5 },
    { timestamp: '14:00', soilMoisture: 84, tilt: 5.6, porePressure: 58.4 }
  ],
  6: [
    { timestamp: '10:00', soilMoisture: 84, tilt: 5.6, porePressure: 58.4 },
    { timestamp: '11:00', soilMoisture: 70, tilt: 5.7, porePressure: 50 },
    { timestamp: '12:00', soilMoisture: 65, tilt: 5.7, porePressure: 42 },
    { timestamp: '13:00', soilMoisture: 60, tilt: 5.7, porePressure: 34 },
    { timestamp: '14:00', soilMoisture: 55, tilt: 5.7, porePressure: 28 }
  ],
};
