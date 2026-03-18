import axios, { AxiosInstance } from 'axios';
import { Entry, FeelingEntry, Insight, TrendsData, TrendDataPoint } from '../types/index';
import { mockApiClient } from './mocks';

const USE_MOCKS = false; // Disable mocks - use real API with seeded data

export interface IApiClient {
  createEntry(
    type: 'workout' | 'meal',
    raw_text: string,
    occurred_at: string
  ): Promise<Entry>;
  getEntries(userId: string, limit?: number, page?: number): Promise<Entry[]>;
  addFeeling(
    entryId: string,
    when: 'pre' | 'post',
    valence: number,
    energy: number,
    stress: number,
    notes?: string
  ): Promise<FeelingEntry>;
  getTrends(userId: string, windowDays?: number): Promise<TrendsData>;
  getInsights(userId: string): Promise<Insight[]>;
  dismissInsight(insightId: string): Promise<void>;
  deleteEntry(entryId: string): Promise<void>;
}

class ApiClient implements IApiClient {
  private axiosInstance: AxiosInstance;
  public baseURL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to all requests
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        // Handle 401 Unauthorized (token expired, invalid, etc.)
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        throw error;
      }
    );
  }

  async createEntry(
    type: 'workout' | 'meal',
    raw_text: string,
    occurred_at: string
  ): Promise<Entry> {
    if (USE_MOCKS) {
      return mockApiClient.createEntry(type, raw_text, occurred_at);
    }

    const response = await this.axiosInstance.post<Entry>('/entries', {
      type,
      raw_text,
      occurred_at,
    });
    return response.data;
  }

  async getEntries(userId: string, limit?: number, page?: number): Promise<Entry[]> {
    if (USE_MOCKS) {
      return mockApiClient.getEntries(userId, limit);
    }

    const response = await this.axiosInstance.get<Entry[]>('/entries', {
      params: { userId, limit: limit || 100, offset: ((page || 1) - 1) * (limit || 100) },
    });
    return response.data;
  }

  async addFeeling(
    entryId: string,
    when: 'pre' | 'post',
    valence: number,
    energy: number,
    stress: number,
    notes?: string
  ): Promise<FeelingEntry> {
    if (USE_MOCKS) {
      return mockApiClient.addFeeling(entryId, when, valence, energy, stress, notes);
    }

    const response = await this.axiosInstance.post<FeelingEntry>(
      `/entries/${entryId}/feelings`,
      {
        when,
        valence,
        energy,
        stress,
        notes,
      }
    );
    return response.data;
  }

  async getTrends(userId: string, windowDays?: number): Promise<TrendsData> {
    if (USE_MOCKS) {
      return mockApiClient.getTrends(userId, windowDays);
    }

    // The backend returns a TrendSnapshot:
    // { baselines: [...], recent: [...] }
    const response = await this.axiosInstance.get<{
      baselines: Array<{
        id: string;
        scope: string;
        metric: string;
        value: number;
        data_points: number;
        window_days: number;
        updated_at: string;
      }>;
      recent: Array<{
        id: string;
        entered: string;
        type: string;
        post_energy: number | null;
        post_valence: number | null;
        stress: number | null;
      }>;
    }>('/trends', {
      params: (() => {
        const params: Record<string, unknown> = {
          window_days: windowDays ?? 7,
        };
        // Only send user_id override if we actually have one;
        // otherwise let the backend derive it from the JWT.
        if (userId) {
          params.user_id = userId;
        }
        return params;
      })(),
    });

    const { baselines, recent } = response.data;

    // For now, default to the post-activity energy metric, which matches the
    // existing TrendsData "post-energy" metric key used in the UI.
    const metricKey = 'post_energy';
    const window = windowDays ?? 7;

    const baselineForMetric = baselines.find(
      (b) => b.metric === metricKey && b.window_days === window
    );
    const baselineValue = baselineForMetric?.value ?? 0;

    const data: TrendDataPoint[] = recent
      .filter((r) => r.post_energy !== null)
      .map((r) => ({
        date: r.entered.split('T')[0],
        baseline: Math.round(baselineValue),
        actual: r.post_energy as number,
      }))
      // Backend returns most recent first; chart expects chronological order.
      .reverse();

    return {
      metric: 'post-energy',
      data,
      windowDays: window,
    };
  }

  async getInsights(userId: string): Promise<Insight[]> {
    if (USE_MOCKS) {
      return mockApiClient.getInsights(userId);
    }

    // Backend derives user ID from JWT; no need to pass explicit user_id here.
    const response = await this.axiosInstance.get<
      Array<{
        id: string;
        user_id: string;
        type: string;
        summary: string;
        supporting_stats: Record<string, unknown> | null;
        rule_name: string;
        created_at: string;
        is_active: boolean;
      }>
    >('/insights');

    // Adapt backend insight shape to frontend `Insight` contract.
    return response.data.map((insight) => {
      const statsObject = insight.supporting_stats ?? {};
      const stats =
        typeof statsObject === 'object' && statsObject !== null
          ? Object.entries(statsObject).map(([key, value]) => ({
              key,
              value: value as string | number,
            }))
          : [];

      return {
        id: insight.id,
        userId: insight.user_id,
        category: insight.type,
        // Use rule name as a rough title; frontend copy can refine this later.
        title: insight.rule_name.replace(/_/g, ' '),
        summary: insight.summary,
        stats,
        dismissed: !insight.is_active,
        createdAt: insight.created_at,
      } as Insight;
    });
  }

  async dismissInsight(insightId: string): Promise<void> {
    if (USE_MOCKS) {
      return mockApiClient.dismissInsight(insightId);
    }

    await this.axiosInstance.patch(`/insights/${insightId}/dismiss`);
  }

  async deleteEntry(entryId: string): Promise<void> {
    if (USE_MOCKS) {
      // No-op for now; history in mock mode is ephemeral anyway.
      return;
    }

    await this.axiosInstance.delete(`/entries/${entryId}`);
  }
}

export const apiClient = new ApiClient();
export const api = apiClient;
