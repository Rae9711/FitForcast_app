import React, { useState } from 'react';
import { Entry } from '../types/index';

interface EntryListProps {
  entries: Entry[];
  onSelectEntry?: (entry: Entry) => void;
  isLoading?: boolean;
  onDeleteEntry?: (entryId: string) => void;
}

export const EntryList: React.FC<EntryListProps> = ({
  entries,
  onSelectEntry,
  isLoading = false,
  onDeleteEntry,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'workout' | 'meal'>('all');

  const filteredEntries =
    filterType === 'all' ? entries : entries.filter((e) => e.type === filterType);

  const getTypeIcon = (type: 'workout' | 'meal') => {
    return type === 'workout' ? '🏃' : '🍽️';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFeelingBadge = (feeling: any) => {
    if (!feeling) return null;
    const colors: Record<string, string> = {
      'Very Positive': 'bg-green-100 text-green-800',
      Positive: 'bg-blue-100 text-blue-800',
      Neutral: 'bg-gray-100 text-gray-800',
      Negative: 'bg-orange-100 text-orange-800',
      'Very Negative': 'bg-red-100 text-red-800',
    };

    const valenceMap: Record<number, string> = {
      100: 'Very Positive',
      50: 'Positive',
      0: 'Neutral',
      '-50': 'Negative',
      '-100': 'Very Negative',
    };

    const getLabel = (v: number) => {
      if (v > 50) return 'Very Positive';
      if (v > 20) return 'Positive';
      if (v > -20) return 'Neutral';
      if (v > -50) return 'Negative';
      return 'Very Negative';
    };

    const label = getLabel(feeling.valence);
    const color = colors[label] || colors.Neutral;
    return <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>{label}</span>;
  };

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading entries...</div>;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No entries yet. Start by logging a workout or meal!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1 rounded ${
            filterType === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterType('workout')}
          className={`px-3 py-1 rounded ${
            filterType === 'workout'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🏃 Workouts
        </button>
        <button
          onClick={() => setFilterType('meal')}
          className={`px-3 py-1 rounded ${
            filterType === 'meal'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🍽️ Meals
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Date</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Type</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Description</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Feelings</th>
              {onDeleteEntry && (
                <th className="px-4 py-2 text-right font-semibold text-gray-700">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry) => (
              <tr
                key={entry.id}
                onClick={() => onSelectEntry?.(entry)}
                className={`border-b hover:bg-gray-50 ${
                  onSelectEntry ? 'cursor-pointer' : ''
                }`}
              >
                <td className="px-4 py-3 text-gray-600 text-xs">
                  {formatDate(entry.occurred_at)}
                </td>
                <td className="px-4 py-3 text-xl">{getTypeIcon(entry.type)}</td>
                <td className="px-4 py-3 text-gray-800 max-w-xs truncate">
                  {entry.raw_text}
                </td>
                <td className="px-4 py-3">
                  {entry.feelings && entry.feelings.length > 0 && (
                    <div className="space-y-1">
                      {entry.feelings.map((f) => (
                        <div key={f.id}>{getFeelingBadge(f)}</div>
                      ))}
                    </div>
                  )}
                </td>
                {onDeleteEntry && (
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEntry(entry.id);
                      }}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center text-xs text-gray-500">
        Showing {filteredEntries.length} of {entries.length} entries
      </div>
    </div>
  );
};
