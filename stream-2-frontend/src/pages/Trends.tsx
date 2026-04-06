import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { InsightCard } from '../components/InsightCard';
import { PredictionPanel } from '../components/PredictionPanel';
import { TrendsChart } from '../components/TrendsChart';
import { useAppContext } from '../context/AppProvider';
import { PredictionBundle, TrendMetricKey, TrendsData } from '../types/index';

export const Trends: React.FC = () => {
  const navigate = useNavigate();
  const { userId, insights, setInsights, dismissInsight, setLoading, setError } = useAppContext();
  const [trendsData, setTrendsData] = useState<TrendsData | null>(null);
  const [predictions, setPredictions] = useState<PredictionBundle | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<TrendMetricKey>('post-energy');
  const [selectedWindow, setSelectedWindow] = useState(30);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [trends, fetchedInsights, fetchedPredictions] = await Promise.all([
          apiClient.getTrends(userId, selectedWindow, selectedMetric),
          apiClient.getInsights(userId),
          apiClient.getPredictions(userId),
        ]);
        setTrendsData(trends);
        setInsights(fetchedInsights);
        setPredictions(fetchedPredictions);
      } catch (error) {
        setError('Failed to load trend data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadData();
    }
  }, [selectedMetric, selectedWindow, setError, setInsights, setLoading, userId]);

  const handleDismissInsight = async (insightId: string) => {
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Trends</h1>
          <p className="mt-2 text-slate-500">Use baselines, recent activity, and insights together to understand what is repeatable and what needs adjustment.</p>
        </div>
        <button
          onClick={() => navigate('/log')}
          className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
        >
          Log another entry
        </button>
      </div>

      {trendsData && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <TrendsChart
            data={trendsData}
            onMetricChange={(metric) => setSelectedMetric(metric as TrendMetricKey)}
            onWindowChange={setSelectedWindow}
          />
        </section>
      )}

      {predictions && <PredictionPanel bundle={predictions} />}

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Insight stack</h2>
          <p className="text-sm text-slate-500">The same rules shown on the dashboard remain available here so you can compare them against the charts.</p>
        </div>
        {insights.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm">
            No active insights yet. Keep logging complete entries to build stronger trend signals.
          </div>
        ) : (
          insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} onDismiss={handleDismissInsight} />
          ))
        )}
      </section>
    </div>
  );
};