import { apiClient, ApiResponse } from './apiClient';
import { EmergencyPriority } from '../../types';
import { initialEmergencyPriorities } from '../../data/demoData';

export const emergencyService = {
  async getEmergencyPriorities(): Promise<ApiResponse<EmergencyPriority[]>> {
    try {
      const res = await apiClient.get<EmergencyPriority[]>('/emergency-priorities');
      return res;
    } catch (err) {
      console.warn('Emergency priorities API unavailable, using demo fallback:', err);
      return {
        data: [...initialEmergencyPriorities],
        status: 200,
        message: 'Demo fallback emergency priorities',
        timestamp: new Date().toISOString(),
        source: 'DEMO_FALLBACK',
      };
    }
  },
};
