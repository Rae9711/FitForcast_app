import { Entry, FeelingEntry, Insight, PredictionBundle, TrendMetricKey, TrendsData } from '../types/index';

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
    valence: 3,
    energy: 3,
    stress: 2,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'feel-2',
    entryId: 'entry-1',
    when: 'post',
    valence: 4,
    energy: 4,
    stress: 1,
    notes: 'Felt great after the run!',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'feel-3',
    entryId: 'entry-2',
    when: 'pre',
    valence: 3,
    energy: 3,
    stress: 2,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'feel-4',
    entryId: 'entry-2',
    when: 'post',
    valence: 4,
    energy: 4,
    stress: 1,
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
    priority: 'high',
    title: 'Post-Workout Energy Boost',
    summary: 'Your energy levels increase by 45% on average after workouts.',
    bullets: ['Morning sessions are strongest.', 'Energy gains hold across the week.', 'Keep logging post-workout feelings.'],
    stats: [
      { label: 'avg_boost', value: '+45%' },
      { label: 'in_last_14d', value: '12 workouts' },
      { label: 'correlation', value: 'Strong' },
    ],
    dismissed: false,
    createdAt: new Date().toISOString(),
    source: 'deterministic',
    ruleName: 'post_workout_energy_boost',
  },
  {
    id: 'insight-2',
    userId: 'user-123',
    category: 'stress',
    priority: 'medium',
    title: 'Morning Routine Impact',
    summary: 'Morning workouts reduce stress levels more than afternoon ones.',
    bullets: ['Pre-workout stress starts lower in the morning.', 'Post-workout stress drops faster.', 'Late sessions are less reliable.'],
    stats: [
      { label: 'morning_stress_reduction', value: '-35%' },
      { label: 'afternoon_stress_reduction', value: '-20%' },
      { label: 'sample_size', value: '18 workouts' },
    ],
    dismissed: false,
    createdAt: new Date().toISOString(),
    source: 'deterministic',
    ruleName: 'morning_routine_impact',
  },
  {
    id: 'insight-3',
    userId: 'user-123',
    category: 'nutrition',
    priority: 'medium',
    title: 'Protein & Satiety',
    summary: 'High-protein meals correlate with improved afternoon energy.',
    bullets: ['Post-workout meals lead to steadier energy.', 'Breakfast supports the afternoon.', 'Meal timing is consistent.'],
    stats: [
      { label: 'correlation_strength', value: '0.72' },
      { label: 'meals_logged', value: '42' },
      { label: 'consistency', value: '86%' },
    ],
    dismissed: false,
    createdAt: new Date().toISOString(),
    source: 'deterministic',
    ruleName: 'protein_satiety',
  },
];

export const mockTrendsData: TrendsData = {
  metric: 'post-energy',
  windowDays: 30,
  availableMetrics: ['post-energy', 'post-valence', 'post-stress'],
  data: Array.from({ length: 30 }, (_, i) => {
    const daysAgo = 29 - i;
    const baselineValue = 3 + Math.random() * 0.8 - 0.4;
    const actualValue = baselineValue + (Math.random() * 1.2 - 0.6);

    return {
      date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      baseline: Math.max(1, Math.min(5, Number(baselineValue.toFixed(1)))),
      actual: Math.max(1, Math.min(5, Number(actualValue.toFixed(1)))),
    };
  }),
  summaries: [
    { label: 'Baseline', value: '3.2/5', detail: '30-day rolling average', direction: 'flat' },
    { label: 'Recent Average', value: '3.7/5', detail: '30 logged samples', direction: 'up' },
    { label: 'Change', value: '+0.5', detail: 'Recent average vs baseline', direction: 'up' },
  ],
  patternHighlights: ['30 tracked samples in the last 30 days', '8 morning workouts vs 1 late-night workout', 'The trend is moving in a favorable direction.'],
  recommendations: ['Keep logging both pre and post feelings so each trend stays explainable.', 'Use the History page to compare entries around your strongest days.'],
};

export const mockPredictions: PredictionBundle = {
  userId: mockUser.id,
  generatedAt: new Date().toISOString(),
  windows: [7, 30, 90, 180],
  heuristics: [
    {
      id: 'timing-30',
      category: 'timing',
      title: 'Workout timing is now personal',
      summary: 'Morning sessions outperform later ones in your recent data, so the model now treats timing as a strong personal lever.',
      recommendation: 'Protect two early workout slots this week and compare them against your late sessions.',
      direction: 'positive',
      effectSize: 0.9,
      confidence: 0.82,
      confidenceLabel: 'strong',
      sampleCount: 16,
      windowDays: 30,
      evidence: [
        { label: 'evaluation_window', value: '30 days' },
        { label: 'combined_effect', value: '0.9' },
        { label: 'confidence', value: '82%' },
      ],
    },
  ],
  defaultScenario: {
    id: 'default',
    label: 'Default next workout',
    description: 'Uses the preferred timing and fueling pattern from recent history.',
    plannedHour: 7,
    workoutKind: 'cardio',
    includeBreakfast: true,
    includeProteinRecoveryMeal: true,
    predictions: {
      expectedPostWorkoutEnergy: { value: 4.2, confidence: 0.8, confidenceLabel: 'strong', sampleCount: 18, contributors: [] },
      expectedPostWorkoutStress: { value: 1.8, confidence: 0.76, confidenceLabel: 'moderate', sampleCount: 18, contributors: [] },
      goodSessionLikelihood: { value: 0.81, confidence: 0.79, confidenceLabel: 'strong', sampleCount: 18, contributors: [] },
      nextDayRecoveryQuality: { value: 0.74, confidence: 0.68, confidenceLabel: 'moderate', sampleCount: 12, contributors: [] },
    },
  },
  scenarioComparisons: [],
  modelNotes: {
    userWorkoutSamples: 18,
    globalWorkoutSamples: 60,
    personalWeight: 0.64,
    globalWeight: 0.36,
    calibrationNote: 'The hybrid model leans mostly on the individual user, then uses the global set as a stabilizer.',
  },
  narrative: {
    headline: 'Your next workout is forecastable',
    coachSummary: 'The model expects a strong session when you keep your morning timing and fueling pattern intact.',
    priorities: ['Keep the morning slot.', 'Pair it with breakfast support.', 'Log both feelings again.'],
    nextActions: ['Repeat your strongest pattern twice this week.', 'Avoid pushing the next hard workout late.', 'Compare the predicted and actual recovery score.'],
    checkInQuestions: ['Did the session match the forecasted energy score?', 'Was next-day recovery better when you held the same routine?'],
  },
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

  async getTrends(_userId: string, windowDays?: number, metric: TrendMetricKey = 'post-energy'): Promise<TrendsData> {
    return { ...mockTrendsData, metric, windowDays: windowDays || 30 };
  },

  async getInsights(_userId: string): Promise<Insight[]> {
    return mockInsights.filter((i) => !i.dismissed);
  },

  async getPredictions(_userId: string): Promise<PredictionBundle> {
    return mockPredictions;
  },

  async dismissInsight(insightId: string): Promise<void> {
    const insight = mockInsights.find((i) => i.id === insightId);
    if (insight) {
      insight.dismissed = true;
    }
  },
};
