import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppProvider';
import { apiClient } from '../api/client';
import { EntryList } from '../components/EntryList';
import { Entry } from '../types/index';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const { userId, entries, setEntries, setLoading, setError } = useAppContext();

  useEffect(() => {
    const loadEntries = async () => {
      try {
        setLoading(true);
        const fetchedEntries = await apiClient.getEntries(userId, 100);
        setEntries(fetchedEntries);
      } catch (err) {
        setError('Failed to load entries');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, [userId]);

  const handleSelectEntry = (entry: Entry) => {
    console.log('Selected entry:', entry);
    // Could navigate to entry details page in the future
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      setLoading(true);
      await apiClient.deleteEntry(entryId);
      setEntries(entries.filter((e) => e.id !== entryId));
    } catch (err) {
      setError('Failed to delete entry');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your History</h1>
          <p className="text-gray-600 mt-2">
            Track all your logged workouts and meals
          </p>
        </div>
        <button
          onClick={() => navigate('/log')}
          className="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
        >
          + New Entry
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <EntryList
          entries={entries}
          onSelectEntry={handleSelectEntry}
          onDeleteEntry={handleDeleteEntry}
        />
      </div>

      {/* Stats Footer */}
      {entries.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {entries.length}
            </div>
            <div className="text-sm text-gray-600">Total Entries</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {entries.filter((e) => e.type === 'workout').length}
            </div>
            <div className="text-sm text-gray-600">Workouts</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-secondary mb-1">
              {entries.filter((e) => e.type === 'meal').length}
            </div>
            <div className="text-sm text-gray-600">Meals</div>
          </div>
        </div>
      )}

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
