import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendsData } from '../types/index';

interface TrendsChartProps {
  data: TrendsData;
  onMetricChange?: (metric: string) => void;
  onWindowChange?: (days: number) => void;
  isLoading?: boolean;
}

export const TrendsChart: React.FC<TrendsChartProps> = ({
  data,
  onMetricChange,
  onWindowChange,
  isLoading = false,
}) => {
  const metrics = [
    'post-energy',
    'post-valence',
    'post-stress',
    'frequency',
    'consistency',
  ];

  // Supported windows should align with backend BASELINE_WINDOWS / SUPPORTED_WINDOWS
  const windows = [7, 30, 365];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Metric
          </label>
          <select
            onChange={(e) => onMetricChange?.(e.target.value)}
            defaultValue="post-energy"
            className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
          >
            {metrics.map((m) => (
              <option key={m} value={m}>
                {m.replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Range
          </label>
          <select
            onChange={(e) => onWindowChange?.(parseInt(e.target.value))}
            defaultValue={data.windowDays}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
          >
            {windows.map((w) => (
              <option key={w} value={w}>
                Last {w} days
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval={Math.floor(data.data.length / 7)}
            />
            {/* Feelings are on a 1–5 scale; match the Y-axis to that so Athena's demo data is readable. */}
            <YAxis domain={[0, 5]} tickCount={6} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="#8884d8"
              name="Your Baseline"
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#82ca9d"
              name="Recent Activity"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-blue-50 p-4 rounded">
          <div className="text-gray-600 font-medium">Your Baseline</div>
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(
              data.data.reduce((acc, d) => acc + d.baseline, 0) / data.data.length
            )}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <div className="text-gray-600 font-medium">Recent Avg</div>
          <div className="text-2xl font-bold text-green-600">
            {Math.round(
              data.data.reduce((acc, d) => acc + d.actual, 0) / data.data.length
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
