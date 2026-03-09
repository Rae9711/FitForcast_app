import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppProvider';
import { apiClient } from '../api/client';
import { TrendsChart } from '../components/TrendsChart';
import { InsightCard } from '../components/InsightCard';
import { TrendsData } from '../types/index';

export const Trends: React.FC = () => {
  const navigate = useNavigate();
  const { userId, insights, setInsights, dismissInsight, setLoading, setError } =
    useAppContext();
  const [trendsData, setTrendsData] = useState<TrendsData | null>(null);
  const [selectedMetric, setSelectedMetric] = useState('post-energy');
  const [selectedWindow, setSelectedWindow] = useState(30);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [trends, insights_data] = await Promise.all([
          apiClient.getTrends(userId, selectedWindow),
          apiClient.getInsights(userId),
        ]);
        setTrendsData(trends);
        setInsights(insights_data);
      } catch (err) {
        setError('Failed to load trends data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, selectedWindow]);

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric);
    // In a real app, we'd refetch data for the new metric
  };

  const handleWindowChange = (days: number) => {
    setSelectedWindow(days);
  };

  const handleDismissInsight = async (insightId: string) => {
    try {
      await apiClient.dismissInsight(insightId);
      dismissInsight(insightId);
    } catch (err) {
      setError('Failed to dismiss insight');
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Trends</h1>
          <p className="text-gray-600 mt-2">
            Compare your baseline with recent activity
          </p>
        </div>
        <button
          onClick={() => navigate('/log')}
          className="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
        >
          + Log Entry
        </button>
      </div>

      {/* Trends Chart */}
      {trendsData && (
        <div className="bg-white rounded-lg shadow p-6">
          <TrendsChart
            data={trendsData}
            onMetricChange={handleMetricChange}
            onWindowChange={handleWindowChange}
          />
        </div>
      )}

      {/* Insights Section */}
      {insights.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Personalized Insights</h2>
          <div className="space-y-3">
            {insights.map((insight) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onDismiss={handleDismissInsight}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State for Insights */}
      {insights.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No insights yet
          </h3>
          <p className="text-gray-600">
            Keep logging entries to unlock personalized insights based on your patterns
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Understanding Your Trends</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• <strong>Baseline:</strong> Your historical average across all entries</li>
          <li>• <strong>Recent Activity:</strong> Your current performance in the selected time window</li>
          <li>• <strong>Insights:</strong> Actionable discoveries based on your logged data</li>
        </ul>
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};
