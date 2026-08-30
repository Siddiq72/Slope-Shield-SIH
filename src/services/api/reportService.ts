import { apiClient, ApiResponse } from './apiClient';
import { FieldReport } from '../../types';
import { initialFieldReports } from '../../data/demoData';

export const reportService = {
  async getAllReports(): Promise<ApiResponse<FieldReport[]>> {
    try {
      const res = await apiClient.get<FieldReport[]>('/reports');
      return res;
    } catch (err) {
      console.warn('Reports API unavailable, using demo fallback:', err);
      return {
        data: [...initialFieldReports],
        status: 200,
        message: 'Demo fallback field reports',
        timestamp: new Date().toISOString(),
        source: 'DEMO_FALLBACK',
      };
    }
  },

  async createReport(reportData: Omit<FieldReport, 'id' | 'ticketNumber' | 'timestamp' | 'status' | 'confidenceScore'>): Promise<ApiResponse<FieldReport>> {
    try {
      const res = await apiClient.post<FieldReport>('/reports', reportData);
      return res;
    } catch (err) {
      console.warn('Create report API fallback:', err);
      const fallbackReport: FieldReport = {
        ...reportData,
        id: `rep-${Date.now()}`,
        ticketNumber: `FR-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: 'Just now (T-0:00)',
        status: 'NEW',
        confidenceScore: 95,
        triageNotes: 'Instant GPS timestamp verified. Spatial clustering matched with sensor telemetry.'
      };
      return {
        data: fallbackReport,
        status: 201,
        message: 'Created report locally',
        timestamp: new Date().toISOString(),
        source: 'DEMO_FALLBACK',
      };
    }
  },

  async updateReportStatus(
    id: string, 
    status: FieldReport['status'], 
    notes?: string
  ): Promise<ApiResponse<{ success: boolean; id: string; status: FieldReport['status']; notes?: string }>> {
    try {
      const res = await apiClient.patch<{ success: boolean; id: string; status: FieldReport['status']; notes?: string }>(
        `/reports/${id}`,
        { status, notes }
      );
      return res;
    } catch (err) {
      console.warn('Update report API fallback:', err);
      return {
        data: { success: true, id, status, notes },
        status: 200,
        message: 'Updated report status locally',
        timestamp: new Date().toISOString(),
        source: 'DEMO_FALLBACK',
      };
    }
  },
};
