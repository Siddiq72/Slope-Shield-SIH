import { apiClient, ApiResponse } from './apiClient';
import { Alert } from '../../types';
import { initialAlerts } from '../../data/demoData';

export const alertService = {
  async getAllAlerts(): Promise<ApiResponse<Alert[]>> {
    try {
      const res = await apiClient.get<Alert[]>('/alerts');
      return res;
    } catch (err) {
      console.warn('Alerts API unavailable, using demo fallback:', err);
      return {
        data: [...initialAlerts],
        status: 200,
        message: 'Demo fallback alerts',
        timestamp: new Date().toISOString(),
        source: 'DEMO_FALLBACK',
      };
    }
  },

  async acknowledgeAlert(alertId: string): Promise<ApiResponse<{ success: boolean; alertId: string; acknowledgedAt: string }>> {
    try {
      const res = await apiClient.post<{ success: boolean; alertId: string; acknowledgedAt: string }>(
        '/alerts/acknowledge',
        { alertId }
      );
      return res;
    } catch (err) {
      console.warn('Acknowledge alert API fallback:', err);
      return {
        data: {
          success: true,
          alertId,
          acknowledgedAt: new Date().toISOString(),
        },
        status: 200,
        message: 'Alert acknowledged locally',
        timestamp: new Date().toISOString(),
        source: 'DEMO_FALLBACK',
      };
    }
  },

  async dispatchSmsAlert(payload: {
    recipientNumber?: string;
    alertLevel: string;
    zoneCode: string;
    channels?: string[];
  }): Promise<ApiResponse<{
    success: boolean;
    status: string;
    gateway: string;
    messageId: string;
    dispatchedTo: string;
    timestamp: string;
  }>> {
    try {
      const res = await apiClient.post<any>('/alerts/dispatch-sms', payload);
      return res;
    } catch (err) {
      console.warn('Dispatch SMS API fallback:', err);
      return {
        data: {
          success: true,
          status: 'DISPATCHED',
          gateway: 'simulated-cap-relay',
          messageId: `CAP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          dispatchedTo: payload.recipientNumber || 'DDMA Response Roster (48 Contacts)',
          timestamp: new Date().toISOString(),
        },
        status: 200,
        message: 'Dispatched via local simulated gateway',
        timestamp: new Date().toISOString(),
        source: 'DEMO_FALLBACK',
      };
    }
  },
};
