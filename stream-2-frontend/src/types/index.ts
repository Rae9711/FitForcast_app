export interface FeelingEntry {
  id: string;
  entryId: string;
  when: 'pre' | 'post';
  valence: number; // -100 to 100
  energy: number;  // 0 to 100
  stress: number;  // 0 to 100
  notes?: string;
  createdAt: string;
}

export interface Entry {
  id: string;
  userId: string;
  type: 'workout' | 'meal';
  raw_text: string;
  occurred_at: string;
  createdAt: string;
  feelings?: FeelingEntry[];
}

export interface Insight {
  id: string;
  userId: string;
  category: string;
  title: string;
  summary: string;
  stats: {
    key: string;
    value: string | number;
  }[];
  dismissed: boolean;
  createdAt: string;
}

export interface TrendDataPoint {
  date: string;
  baseline: number;
  actual: number;
}

export interface TrendsData {
  metric: string;
  data: TrendDataPoint[];
  windowDays: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
