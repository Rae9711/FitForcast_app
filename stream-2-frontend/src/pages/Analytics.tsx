import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { GoalTracker } from '../components/GoalTracker';
import { useAppContext } from '../context/AppProvider';
import { AnalyticsBundle, Goal } from '../types/index';

const toneForSeverity = {
  opportunity: 'border-emerald-200 bg-emerald-50',
  stable: 'border-sky-200 bg-sky-50',
  watch: 'border-rose-200 bg-rose-50',
} as const;

export const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const { userId, setLoading, setError } = useAppContext();
  const [analytics, setAnalytics] = useState<AnalyticsBundle | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [windowDays, setWindowDays] = useState(30);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [analyticsBundle, fetchedGoals] = await Promise.all([
          apiClient.getAnalytics(userId, windowDays),
          apiClient.getGoals(),
        ]);
        setAnalytics(analyticsBundle);
        setGoals(fetchedGoals);
      } catch (error) {
        setError('Failed to load analytics');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadData();
    }
  }, [setError, setLoading, userId, windowDays]);

  const handleCreateGoal = async (input: Parameters<typeof apiClient.createGoal>[0]) => {
    try {
      const goal = await apiClient.createGoal(input);
      setGoals((current) => [goal, ...current]);
    } catch (error) {
      setError('Failed to create goal');
      throw error;
    }
  };

  const handleUpdateGoal = async (goalId: string, input: Parameters<typeof apiClient.updateGoal>[1]) => {
    try {
      const updated = await apiClient.updateGoal(goalId, input);
      setGoals((current) => current.map((goal) => (goal.id === goalId ? updated : goal)));
    } catch (error) {
      setError('Failed to update goal');
      throw error;
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-xl">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-300">Phase 2 analytics</div>
            <h1 className="mt-3 text-4xl font-bold">Correlation analysis, predictive insights, pattern detection, and goals</h1>
            <p className="mt-3 text-slate-300">
              This workspace now turns your recent logs into explicit relationship analysis, tomorrow-facing risk signals, recurring cycle detection, and goal tracking.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[7, 30, 90].map((value) => (
              <button
                key={value}
                onClick={() => setWindowDays(value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${windowDays === value ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {value} days
              </button>
            ))}
            <button
              onClick={() => navigate('/trends')}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Open trend charts
            </button>
          </div>
        </div>

        {analytics && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <div className="text-sm text-slate-300">Tracked days</div>
              <div className="mt-2 text-3xl font-semibold">{analytics.summary.trackedDays}</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <div className="text-sm text-slate-300">Logged workouts</div>
              <div className="mt-2 text-3xl font-semibold">{analytics.summary.loggedWorkouts}</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <div className="text-sm text-slate-300">Complete samples</div>
              <div className="mt-2 text-3xl font-semibold">{analytics.summary.completeWorkoutSamples}</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <div className="text-sm text-slate-300">Window</div>
              <div className="mt-2 text-3xl font-semibold">{analytics.windowDays}d</div>
            </div>
          </div>
        )}
      </section>

      {analytics && (
        <>
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Correlation analysis</h2>
              <p className="text-sm text-slate-500">These cards call out the strongest variable-to-outcome relationships in your selected window.</p>
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              {analytics.correlations.map((correlation) => (
                <article key={correlation.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">{correlation.confidenceLabel}</span>
                    <span className="text-sm text-slate-500">{correlation.sampleCount} samples</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900">{correlation.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{correlation.summary}</p>
                  <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{correlation.recommendation}</div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {correlation.evidence.map((item) => (
                      <div key={item.label} className="rounded-2xl bg-slate-50 px-4 py-3">
                        <div className="text-xs uppercase tracking-wide text-slate-500">{item.label.replace(/_/g, ' ')}</div>
                        <div className="mt-1 text-lg font-semibold text-slate-900">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Predictive insights</h2>
              <p className="text-sm text-slate-500">Short-horizon outlook cards surface whether tomorrow is likely to be strong, steady, or difficult.</p>
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              {analytics.predictiveInsights.map((insight) => (
                <article key={insight.id} className={`rounded-3xl border p-5 shadow-sm ${toneForSeverity[insight.severity]}`}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">{insight.expectedWindow}</span>
                    <span className="text-sm text-slate-500">{insight.confidenceLabel}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900">{insight.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{insight.summary}</p>
                  <div className="mt-4 rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-700">{insight.recommendation}</div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {insight.evidence.map((item) => (
                      <div key={item.label} className="rounded-2xl bg-white/80 px-4 py-3">
                        <div className="text-xs uppercase tracking-wide text-slate-500">{item.label.replace(/_/g, ' ')}</div>
                        <div className="mt-1 text-lg font-semibold text-slate-900">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Recurring patterns</h2>
              <p className="text-sm text-slate-500">These highlight daily, weekly, and monthly cycles that keep repeating in your data.</p>
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              {analytics.recurringPatterns.map((pattern) => (
                <article key={pattern.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">{pattern.period}</span>
                    <span className="text-sm text-slate-500">{pattern.confidenceLabel}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900">{pattern.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{pattern.summary}</p>
                  <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{pattern.recommendation}</div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {pattern.evidence.map((item) => (
                      <div key={item.label} className="rounded-2xl bg-slate-50 px-4 py-3">
                        <div className="text-xs uppercase tracking-wide text-slate-500">{item.label.replace(/_/g, ' ')}</div>
                        <div className="mt-1 text-lg font-semibold text-slate-900">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      <GoalTracker goals={goals} onCreateGoal={handleCreateGoal} onUpdateGoal={handleUpdateGoal} />
    </div>
  );
};