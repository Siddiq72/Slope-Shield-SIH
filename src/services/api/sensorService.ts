import { apiClient, ApiResponse } from './apiClient';
import { SensorReading } from '../../types';
import { initialSensors } from '../../data/demoData';

export const sensorService = {
  async getAllSensors(): Promise<ApiResponse<SensorReading[]>> {
    try {
      const res = await apiClient.get<SensorReading[]>('/sensors');
      return res;
    } catch (err) {
      console.warn('Sensors API unavailable, using demo fallback:', err);
      return {
        data: [...initialSensors],
        status: 200,
        message: 'Demo fallback sensors',
        timestamp: new Date().toISOString(),
        source: 'DEMO_FALLBACK',
      };
    }
  },

  async getSensorsByZone(zoneCode: string): Promise<ApiResponse<SensorReading[]>> {
    try {
      const res = await apiClient.get<SensorReading[]>(`/sensors/${zoneCode}`);
      return res;
    } catch (err) {
      console.warn(`Sensors for ${zoneCode} API unavailable, using fallback:`, err);
      const sensors = initialSensors.filter((s) => s.zoneCode.toLowerCase() === zoneCode.toLowerCase());
      return {
        data: sensors.length > 0 ? sensors : [initialSensors[0]],
        status: 200,
        message: 'Demo fallback sensors',
        timestamp: new Date().toISOString(),
        source: 'DEMO_FALLBACK',
      };
    }
  },
};
