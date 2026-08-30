// Base API client and simulated latency wrapper for Slope Shield
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
  source: 'SIMULATED_DATA_LAYER' | 'LIVE_GATEWAY';
}

export async function mockApiResponse<T>(data: T, delayMs: number = 60): Promise<ApiResponse<T>> {
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return {
    data,
    status: 200,
    message: 'OK',
    timestamp: new Date().toISOString(),
    source: 'SIMULATED_DATA_LAYER',
  };
}

export const API_BASE_URL = '/api/v1';
