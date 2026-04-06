import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { InsightCard } from '../components/InsightCard';
import { PredictionPanel } from '../components/PredictionPanel';
import { useAppContext } from '../context/AppProvider';
import { useAuth } from '../context/AuthContext';
import { PredictionBundle } from '../types/index';

const formatDateTime = (value?: string) => {
  if (!value) {
    return 'No activity logged yet';
  }

  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const calculateStreak = (dates: string[]) => {
  const uniqueDays = Array.from(new Set(dates.map((date) => date.split('T')[0]))).sort().reverse();
  let streak = 0;
  let cursor = new Date();

  for (const day of uniqueDays) {
    const normalizedCursor = cursor.toISOString().split('T')[0];
    if (day === normalizedCursor) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }
    if (streak === 0) {
      cursor.setDate(cursor.getDate() - 1);
      if (day === cursor.toISOString().split('T')[0]) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }
    }
    break;
  }

  return streak;
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    userId,
    entries,
    insights,
    setEntries,
    setInsights,
    dismissInsight,
    setLoading,
    setError,
  } = useAppContext();
  const [predictions, setPredictions] = React.useState<PredictionBundle | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [fetchedEntries, fetchedInsights, fetchedPredictions] = await Promise.all([
          apiClient.getEntries(userId, 12),
          apiClient.getInsights(userId),
          apiClient.getPredictions(userId),
        ]);
        setEntries(fetchedEntries);
        setInsights(fetchedInsights);
        setPredictions(fetchedPredictions);
      } catch (error) {
        setError('Failed to load dashboard data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadData();
    }
  }, [setEntries, setError, setInsights, setLoading, userId]);

  const topInsights = insights.slice(0, 4);
  const recentEntries = entries.slice(0, 6);

  const stats = useMemo(() => {
    const streak = calculateStreak(entries.map((entry) => entry.occurred_at));
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weeklyEntries = entries.filter((entry) => new Date(entry.occurred_at).getTime() >= weekAgo).length;
    return {
      streak,
      weeklyEntries,
      lastActivity: entries[0]?.occurred_at,
    };
  }, [entries]);

  const handleDismiss = async (insightId: string) => {
    try {
      await apiClient.dismissInsight(insightId);
      dismissInsight(insightId);
    } catch (error) {
      setError('Failed to dismiss insight');
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Dashboard</p>
            <h1 className="mt-3 text-4xl font-bold">Welcome back, {user?.name || user?.email || 'Athlete'}!</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Your recent entries, baselines, and insight rules are all in one place so you can see what is working and what needs attention.
            </p>
            <p className="mt-4 text-sm text-slate-400">Last activity: {formatDateTime(stats.lastActivity)}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[420px]">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <div className="text-sm text-slate-300">Current streak</div>
              <div className="mt-2 text-3xl font-semibold">{stats.streak} days</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <div className="text-sm text-slate-300">Entries this week</div>
              <div className="mt-2 text-3xl font-semibold">{stats.weeklyEntries}</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <div className="text-sm text-slate-300">Active insights</div>
              <div className="mt-2 text-3xl font-semibold">{topInsights.length}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <button
          onClick={() => navigate('/log')}
          className="rounded-2xl bg-sky-600 px-6 py-5 text-left text-white shadow transition hover:bg-sky-500"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-sky-100">Quick action</div>
          <div className="mt-2 text-2xl font-semibold">Log a new workout or meal</div>
          <div className="mt-1 text-sm text-sky-100">Capture timing plus pre and post feelings in one flow.</div>
        </button>
        <button
          onClick={() => navigate('/trends')}
          className="rounded-2xl bg-emerald-600 px-6 py-5 text-left text-white shadow transition hover:bg-emerald-500"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-100">Quick action</div>
          <div className="mt-2 text-2xl font-semibold">Review your trend lines</div>
          <div className="mt-1 text-sm text-emerald-100">Compare your recent baselines against the last month or quarter.</div>
        </button>
        <button
          onClick={() => navigate('/analytics')}
          className="rounded-2xl bg-amber-500 px-6 py-5 text-left text-slate-950 shadow transition hover:bg-amber-400"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-amber-900">Phase 2</div>
          <div className="mt-2 text-2xl font-semibold">Open advanced analytics</div>
          <div className="mt-1 text-sm text-amber-950/80">Inspect correlations, tomorrow-facing predictions, recurring patterns, and tracked goals.</div>
        </button>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Recent entries</h2>
              <p className="text-sm text-slate-500">Your latest logged workouts and meals with pre and post context.</p>
            </div>
            <button onClick={() => navigate('/history')} className="text-sm font-medium text-sky-700 hover:text-sky-600">
              View all
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {recentEntries.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                No entries yet. Log your first workout or meal to start building insights.
              </div>
            )}

            {recentEntries.map((entry) => {
              const pre = entry.feelings?.find((feeling) => feeling.when === 'pre');
              const post = entry.feelings?.find((feeling) => feeling.when === 'post');
              return (
                <article key={entry.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">{entry.type}</div>
                      <div className="mt-1 text-lg font-medium text-slate-900">{entry.raw_text}</div>
                    </div>
                    <div className="text-sm text-slate-500">{formatDateTime(entry.occurred_at)}</div>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                      <div className="font-medium text-slate-900">Before</div>
                      <div className="mt-1">Mood {pre?.valence ?? '-'} / Energy {pre?.energy ?? '-'} / Stress {pre?.stress ?? '-'}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                      <div className="font-medium text-slate-900">After</div>
                      <div className="mt-1">Mood {post?.valence ?? '-'} / Energy {post?.energy ?? '-'} / Stress {post?.stress ?? '-'}</div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Insights for you</h2>
              <p className="text-sm text-slate-500">Prioritized patterns generated from your own recent data.</p>
            </div>
            <button onClick={() => navigate('/trends')} className="text-sm font-medium text-sky-700 hover:text-sky-600">
              Open trends
            </button>
          </div>

          {topInsights.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm">
              Log more complete entries to unlock personalized insights.
            </div>
          ) : (
            topInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} onDismiss={handleDismiss} />
            ))
          )}
        </div>
      </section>

      {predictions && <PredictionPanel bundle={predictions} />}
    </div>
  );
};