/**
 * API client service abstraction for Forest Fire REST endpoints.
 */

import { SystemHealth, RegionSummary, RegionDetail } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `API Request failed with status ${response.status}`;
      try {
        const errorJson = await response.json();
        if (errorJson?.error?.message) {
          errorMessage = errorJson.error.message;
        }
      } catch {
        // Fallback to HTTP status text
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getHealth(): Promise<SystemHealth> {
    return this.fetchJson<SystemHealth>('/health');
  }

  async getRegions(): Promise<{ count: number; results: RegionSummary[] }> {
    return this.fetchJson<{ count: number; results: RegionSummary[] }>('/regions');
  }

  async getRegionDetails(regionId: string): Promise<RegionDetail> {
    return this.fetchJson<RegionDetail>(`/regions/${regionId}`);
  }

  async getActiveFires(): Promise<{ type: string; features: unknown[] }> {
    return this.fetchJson<{ type: string; features: unknown[] }>('/fires/active');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
