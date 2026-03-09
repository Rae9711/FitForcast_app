import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppProvider';
import { apiClient } from '../api/client';
import { InsightCard } from '../components/InsightCard';
import { Insight } from '../types/index';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userId, insights, setInsights, dismissInsight, setLoading, setError } =
    useAppContext();

  const [topInsights, setTopInsights] = useState<Insight[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const fetchedInsights = await apiClient.getInsights(userId);
        setInsights(fetchedInsights);
        setTopInsights(fetchedInsights.slice(0, 3));
        
        // Calculate basic streak (mock implementation)
        setStreak(Math.floor(Math.random() * 7) + 1);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const handleDismiss = async (insightId: string) => {
    try {
      await apiClient.dismissInsight(insightId);
      dismissInsight(insightId);
      setTopInsights((prev) => prev.filter((i) => i.id !== insightId));
    } catch (err) {
      setError('Failed to dismiss insight');
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back! 👋</h1>
        <p className="text-gray-600">Track your fitness journey and discover patterns</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Current Streak</div>
          <div className="text-4xl font-bold">{streak} days</div>
          <div className="text-sm opacity-90 mt-2">Keep it up! 🔥</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">This Week</div>
          <div className="text-4xl font-bold">12</div>
          <div className="text-sm opacity-90 mt-2">Entries logged</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Insights</div>
          <div className="text-4xl font-bold">{topInsights.length}</div>
          <div className="text-sm opacity-90 mt-2">Active discoveries</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/log')}
          className="bg-primary hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition transform hover:scale-105"
        >
          + Log New Entry
        </button>
        <button
          onClick={() => navigate('/trends')}
          className="bg-secondary hover:bg-purple-600 text-white font-bold py-4 px-6 rounded-lg transition transform hover:scale-105"
        >
          📊 View Trends
        </button>
      </div>

      {/* Recent Insights */}
      {topInsights.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Your Insights</h2>
            <button
              onClick={() => navigate('/trends')}
              className="text-primary hover:text-blue-600 text-sm font-medium"
            >
              See All →
            </button>
          </div>
          <div className="space-y-3">
            {topInsights.map((insight) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onDismiss={handleDismiss}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {topInsights.length === 0 && (
        <div className="text-center bg-gray-50 rounded-lg p-8">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No insights yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start logging your workouts and meals to unlock personalized insights
          </p>
          <button
            onClick={() => navigate('/log')}
            className="text-primary hover:text-blue-600 font-medium"
          >
            Log your first entry →
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex justify-center gap-4 text-sm">
        <button
          onClick={() => navigate('/history')}
          className="text-primary hover:underline"
        >
          View History
        </button>
        <span className="text-gray-300">•</span>
        <button
          onClick={() => navigate('/trends')}
          className="text-primary hover:underline"
        >
          View Trends
        </button>
      </div>
    </div>
  );
};
