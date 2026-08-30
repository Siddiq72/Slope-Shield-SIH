/**
 * Centralized API Client for Slope Shield
 * Handles HTTP requests, timeouts, error normalization, and fallback handling
 */

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
  source: 'BACKEND_API' | 'DEMO_FALLBACK';
}

export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number = 500, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// Configurable API base URL with fallback to relative '/api'
export const getApiBaseUrl = (): string => {
  const meta = import.meta as unknown as { env?: Record<string, string | undefined> };
  const envUrl = meta.env?.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.replace(/\/$/, '');
  }
  return '/api';
};

const DEFAULT_TIMEOUT_MS = 6000;

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<ApiResponse<T>> {
  const baseUrl = getApiBaseUrl();
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorJson = await response.json();
        if (errorJson.message || errorJson.detail) {
          errorMessage = errorJson.message || errorJson.detail;
        }
      } catch {
        // use default message
      }
      throw new ApiError(errorMessage, response.status);
    }

    const json = await response.json();
    
    // Handle both wrapped { success, data } and raw payload responses
    const data = json.data !== undefined ? json.data : json;

    return {
      data,
      status: response.status,
      message: 'OK',
      timestamp: new Date().toISOString(),
      source: 'BACKEND_API',
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new ApiError(`Request to ${endpoint} timed out after ${timeoutMs}ms`, 408);
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Network request failed', 0, error);
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit, timeoutMs?: number) =>
    request<T>(endpoint, { ...options, method: 'GET' }, timeoutMs),

  post: <T>(endpoint: string, body?: any, options?: RequestInit, timeoutMs?: number) =>
    request<T>(
      endpoint,
      {
        ...options,
        method: 'POST',
        body: body !== undefined ? JSON.stringify(body) : undefined,
      },
      timeoutMs
    ),

  put: <T>(endpoint: string, body?: any, options?: RequestInit, timeoutMs?: number) =>
    request<T>(
      endpoint,
      {
        ...options,
        method: 'PUT',
        body: body !== undefined ? JSON.stringify(body) : undefined,
      },
      timeoutMs
    ),

  patch: <T>(endpoint: string, body?: any, options?: RequestInit, timeoutMs?: number) =>
    request<T>(
      endpoint,
      {
        ...options,
        method: 'PATCH',
        body: body !== undefined ? JSON.stringify(body) : undefined,
      },
      timeoutMs
    ),

  delete: <T>(endpoint: string, options?: RequestInit, timeoutMs?: number) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }, timeoutMs),
};
