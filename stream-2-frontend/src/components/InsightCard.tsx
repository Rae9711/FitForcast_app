import React from 'react';
import { Insight } from '../types/index';

interface InsightCardProps {
  insight: Insight;
  onDismiss?: (insightId: string) => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, onDismiss }) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      energy: 'bg-yellow-50 border-yellow-200',
      stress: 'bg-red-50 border-red-200',
      nutrition: 'bg-green-50 border-green-200',
      recovery: 'bg-blue-50 border-blue-200',
      consistency: 'bg-purple-50 border-purple-200',
    };
    return colors[category] || 'bg-gray-50 border-gray-200';
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      energy: 'bg-yellow-100 text-yellow-800',
      stress: 'bg-red-100 text-red-800',
      nutrition: 'bg-green-100 text-green-800',
      recovery: 'bg-blue-100 text-blue-800',
      consistency: 'bg-purple-100 text-purple-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`border-l-4 border border-gray-200 rounded-lg p-4 ${getCategoryColor(insight.category)}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${getCategoryBadgeColor(insight.category)}`}>
            {insight.category.charAt(0).toUpperCase() + insight.category.slice(1)}
          </span>
        </div>
        <button
          onClick={() => onDismiss?.(insight.id)}
          className="text-gray-400 hover:text-gray-600 text-xl"
          title="Dismiss this insight"
        >
          ✕
        </button>
      </div>

      <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
      <p className="text-gray-700 text-sm mb-3">{insight.summary}</p>

      <div className="grid grid-cols-2 gap-2">
        {insight.stats.map((stat) => (
          <div key={stat.key} className="bg-white bg-opacity-50 rounded p-2">
            <div className="text-xs text-gray-600 capitalize">
              {stat.key.replace(/_/g, ' ')}
            </div>
            <div className="text-sm font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
