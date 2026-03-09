import axios, { AxiosInstance } from 'axios';
import { Entry, FeelingEntry, Insight, TrendsData } from '../types/index';
import { mockApiClient } from './mocks';

const USE_MOCKS = import.meta.env.DEV; // Use mocks in development

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
}

class ApiClient implements IApiClient {
  private axiosInstance: AxiosInstance;
  private baseURL: string = import.meta.env.VITE_API_BASE_URL || '/api';

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
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
      params: { userId, limit: limit || 50, page: page || 1 },
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

    const response = await this.axiosInstance.get<TrendsData>('/trends', {
      params: { userId, windowDays: windowDays || 30 },
    });
    return response.data;
  }

  async getInsights(userId: string): Promise<Insight[]> {
    if (USE_MOCKS) {
      return mockApiClient.getInsights(userId);
    }

    const response = await this.axiosInstance.get<Insight[]>('/insights', {
      params: { userId },
    });
    return response.data;
  }

  async dismissInsight(insightId: string): Promise<void> {
    if (USE_MOCKS) {
      return mockApiClient.dismissInsight(insightId);
    }

    await this.axiosInstance.patch(`/insights/${insightId}/dismiss`);
  }
}

export const apiClient = new ApiClient();
