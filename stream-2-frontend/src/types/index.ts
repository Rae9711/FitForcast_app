export interface FeelingEntry {
  id: string;
  entryId: string;
  when: 'pre' | 'post';
  valence: number;
  energy: number;
  stress: number;
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

export type InsightPriority = 'high' | 'medium' | 'low';

export interface InsightStat {
  label: string;
  value: string | number;
}

export interface Insight {
  id: string;
  userId: string;
  category: string;
  priority: InsightPriority;
  title: string;
  summary: string;
  bullets: string[];
  stats: InsightStat[];
  dismissed: boolean;
  createdAt: string;
  source: 'deterministic' | 'llm';
  ruleName: string;
}

export type TrendMetricKey = 'post-energy' | 'post-valence' | 'post-stress';

export interface TrendDataPoint {
  date: string;
  baseline: number;
  actual: number;
  pre?: number | null;
  post?: number | null;
}

export interface TrendSummary {
  label: string;
  value: string;
  detail: string;
  direction: 'up' | 'down' | 'flat';
}

export interface TrendsData {
  metric: TrendMetricKey;
  data: TrendDataPoint[];
  windowDays: number;
  availableMetrics: TrendMetricKey[];
  summaries: TrendSummary[];
  patternHighlights: string[];
  recommendations: string[];
}

export interface PersonalizedHeuristic {
  id: string;
  category: 'timing' | 'mood' | 'nutrition' | 'consistency';
  title: string;
  summary: string;
  recommendation: string;
  direction: 'positive' | 'negative';
  effectSize: number;
  confidence: number;
  confidenceLabel: 'emerging' | 'moderate' | 'strong';
  sampleCount: number;
  windowDays: number;
  evidence: Array<{ label: string; value: string | number }>;
}

export interface PredictionMetric {
  value: number;
  confidence: number;
  confidenceLabel: 'emerging' | 'moderate' | 'strong';
  sampleCount: number;
  contributors: Array<{ label: string; value: number }>;
}

export interface ForecastNarrative {
  headline: string;
  coachSummary: string;
  priorities: string[];
  nextActions: string[];
  checkInQuestions: string[];
}

export interface ForecastScenario {
  id: string;
  label: string;
  description: string;
  plannedHour: number;
  workoutKind: 'cardio' | 'strength' | 'recovery' | 'mixed';
  includeBreakfast: boolean;
  includeProteinRecoveryMeal: boolean;
  predictions: {
    expectedPostWorkoutEnergy: PredictionMetric;
    expectedPostWorkoutStress: PredictionMetric;
    goodSessionLikelihood: PredictionMetric;
    nextDayRecoveryQuality: PredictionMetric;
  };
}

export interface PredictionBundle {
  userId: string;
  generatedAt: string;
  windows: number[];
  heuristics: PersonalizedHeuristic[];
  defaultScenario: ForecastScenario;
  scenarioComparisons: ForecastScenario[];
  modelNotes: {
    userWorkoutSamples: number;
    globalWorkoutSamples: number;
    personalWeight: number;
    globalWeight: number;
    calibrationNote: string;
  };
  narrative: ForecastNarrative;
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
