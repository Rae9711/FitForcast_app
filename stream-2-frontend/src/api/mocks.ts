import { Entry, FeelingEntry, Insight, TrendsData } from '../types/index';

export const mockUser = {
  id: 'user-123',
  email: 'demo@fitforecast.app',
  name: 'Demo User',
  createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
};

export const mockFeelings: FeelingEntry[] = [
  {
    id: 'feel-1',
    entryId: 'entry-1',
    when: 'pre',
    valence: 30,
    energy: 40,
    stress: 25,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'feel-2',
    entryId: 'entry-1',
    when: 'post',
    valence: 75,
    energy: 85,
    stress: 10,
    notes: 'Felt great after the run!',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'feel-3',
    entryId: 'entry-2',
    when: 'pre',
    valence: 50,
    energy: 60,
    stress: 35,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'feel-4',
    entryId: 'entry-2',
    when: 'post',
    valence: 65,
    energy: 70,
    stress: 20,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockEntries: Entry[] = [
  {
    id: 'entry-1',
    userId: 'user-123',
    type: 'workout',
    raw_text: '5km morning run in the park, felt strong',
    occurred_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    feelings: [mockFeelings[0], mockFeelings[1]],
  },
  {
    id: 'entry-2',
    userId: 'user-123',
    type: 'meal',
    raw_text: 'Grilled chicken with quinoa and roasted vegetables',
    occurred_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    feelings: [mockFeelings[2], mockFeelings[3]],
  },
  {
    id: 'entry-3',
    userId: 'user-123',
    type: 'workout',
    raw_text: '30 min yoga session, very relaxing',
    occurred_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'entry-4',
    userId: 'user-123',
    type: 'meal',
    raw_text: 'Smoothie bowl with berries and granola',
    occurred_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'entry-5',
    userId: 'user-123',
    type: 'workout',
    raw_text: 'Weight training: 45 min upper body',
    occurred_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockInsights: Insight[] = [
  {
    id: 'insight-1',
    userId: 'user-123',
    category: 'energy',
    title: 'Post-Workout Energy Boost',
    summary: 'Your energy levels increase by 45% on average after workouts.',
    stats: [
      { key: 'avg_boost', value: '+45%' },
      { key: 'in_last_14d', value: '12 workouts' },
      { key: 'correlation', value: 'Strong' },
    ],
    dismissed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'insight-2',
    userId: 'user-123',
    category: 'stress',
    title: 'Morning Routine Impact',
    summary: 'Morning workouts reduce stress levels more than afternoon ones.',
    stats: [
      { key: 'morning_stress_reduction', value: '-35%' },
      { key: 'afternoon_stress_reduction', value: '-20%' },
      { key: 'sample_size', value: '18 workouts' },
    ],
    dismissed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'insight-3',
    userId: 'user-123',
    category: 'nutrition',
    title: 'Protein & Satiety',
    summary: 'High-protein meals correlate with improved afternoon energy.',
    stats: [
      { key: 'correlation_strength', value: '0.72' },
      { key: 'meals_logged', value: '42' },
      { key: 'consistency', value: '86%' },
    ],
    dismissed: false,
    createdAt: new Date().toISOString(),
  },
];

export const mockTrendsData: TrendsData = {
  metric: 'post-energy',
  windowDays: 30,
  data: Array.from({ length: 30 }, (_, i) => {
    const daysAgo = 29 - i;
    const baselineValue = 70 + Math.random() * 10 - 5;
    const actualValue = baselineValue + (Math.random() * 30 - 15);

    return {
      date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      baseline: Math.round(baselineValue),
      actual: Math.round(Math.max(0, Math.min(100, actualValue))),
    };
  }),
};

export const mockApiClient = {
  async createEntry(
    type: 'workout' | 'meal',
    raw_text: string,
    occurred_at: string
  ): Promise<Entry> {
    return {
      id: `entry-${Date.now()}`,
      userId: mockUser.id,
      type,
      raw_text,
      occurred_at,
      createdAt: new Date().toISOString(),
    };
  },

  async getEntries(userId: string, limit?: number): Promise<Entry[]> {
    const entries = mockEntries.filter((e) => e.userId === userId);
    return limit ? entries.slice(0, limit) : entries;
  },

  async addFeeling(
    entryId: string,
    when: 'pre' | 'post',
    valence: number,
    energy: number,
    stress: number,
    notes?: string
  ): Promise<FeelingEntry> {
    return {
      id: `feel-${Date.now()}`,
      entryId,
      when,
      valence,
      energy,
      stress,
      notes,
      createdAt: new Date().toISOString(),
    };
  },

  async getTrends(userId: string, windowDays?: number): Promise<TrendsData> {
    return { ...mockTrendsData, windowDays: windowDays || 30 };
  },

  async getInsights(userId: string): Promise<Insight[]> {
    return mockInsights.filter((i) => !i.dismissed);
  },

  async dismissInsight(insightId: string): Promise<void> {
    const insight = mockInsights.find((i) => i.id === insightId);
    if (insight) {
      insight.dismissed = true;
    }
  },
};
