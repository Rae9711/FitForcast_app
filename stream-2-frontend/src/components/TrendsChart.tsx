import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
  const windows = [7, 30, 90, 365];

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center rounded-3xl bg-slate-50">
        <div className="text-center text-slate-500">Loading trends...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Metric trends</h2>
          <p className="text-sm text-slate-500">Compare your recent scores against the baseline that FitForecast computed from your own history.</p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <label className="text-sm text-slate-600">
            Metric
            <select
              onChange={(event) => onMetricChange?.(event.target.value)}
              value={data.metric}
              className="mt-2 block rounded-2xl border border-slate-300 px-3 py-2 text-slate-900"
            >
              {data.availableMetrics.map((metric) => (
                <option key={metric} value={metric}>
                  {metric.replace('post-', '').replace('-', ' ')}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-slate-600">
            Window
            <select
              onChange={(event) => onWindowChange?.(parseInt(event.target.value, 10))}
              value={data.windowDays}
              className="mt-2 block rounded-2xl border border-slate-300 px-3 py-2 text-slate-900"
            >
              {windows.map((window) => (
                <option key={window} value={window}>
                  Last {window} days
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={24} />
            <YAxis domain={[0, 5]} tickCount={6} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="baseline" stroke="#0f172a" strokeWidth={2} dot={false} name="Baseline" />
            <Line type="monotone" dataKey="actual" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Recent" />
            <Line type="monotone" dataKey="pre" stroke="#94a3b8" strokeDasharray="4 4" dot={false} name="Pre" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {data.summaries.map((summary) => (
          <div key={summary.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm uppercase tracking-wide text-slate-500">{summary.label}</div>
            <div className="mt-3 text-3xl font-semibold text-slate-900">{summary.value}</div>
            <div className="mt-2 text-sm text-slate-500">{summary.detail}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Pattern highlights</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {data.patternHighlights.map((highlight) => (
              <li key={highlight} className="rounded-2xl bg-slate-50 px-4 py-3">
                {highlight}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Recommended next checks</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {data.recommendations.map((recommendation) => (
              <li key={recommendation} className="rounded-2xl bg-slate-50 px-4 py-3">
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};