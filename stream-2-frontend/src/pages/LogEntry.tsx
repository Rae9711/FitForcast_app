import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppProvider';
import { apiClient } from '../api/client';
import { EntryComposer } from '../components/EntryComposer';
import { FeelingCapture } from '../components/FeelingCapture';
import { Entry } from '../types/index';

type Stage = 'entry' | 'pre-feeling' | 'post-feeling' | 'complete';

export const LogEntry: React.FC = () => {
  const navigate = useNavigate();
  const { userId, addEntry, setLoading, setError } = useAppContext();

  const [stage, setStage] = useState<Stage>('entry');
  const [currentEntry, setCurrentEntry] = useState<Entry | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleEntrySubmit = async (
    type: 'workout' | 'meal',
    raw_text: string,
    occurred_at: string
  ) => {
    try {
      setLoading(true);
      const entry = await apiClient.createEntry(type, raw_text, occurred_at);
      setCurrentEntry(entry);
      setStage('pre-feeling');
    } catch (err) {
      setError('Failed to create entry');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeelingSubmit = async (feelings: {
    when: 'pre' | 'post';
    valence: number;
    energy: number;
    stress: number;
    notes?: string;
  }) => {
    if (!currentEntry) return;

    try {
      setLoading(true);
      await apiClient.addFeeling(
        currentEntry.id,
        feelings.when,
        feelings.valence,
        feelings.energy,
        feelings.stress,
        feelings.notes
      );

      if (feelings.when === 'pre') {
        setSuccessMessage('Pre-entry feeling recorded!');
        // Continue to show form for post-feeling in next step
        setTimeout(() => {
          setStage('post-feeling');
        }, 1000);
      } else {
        // Complete the flow
        addEntry(currentEntry);
        setSuccessMessage('Entry logged successfully! 🎉');
        setStage('complete');
        setTimeout(() => {
          navigate('/history');
        }, 2000);
      }
    } catch (err) {
      setError('Failed to record feeling');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Log an Entry</h1>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}

      {/* Entry Composer Stage */}
      {stage === 'entry' && (
        <div className="bg-white rounded-lg shadow p-8">
          <EntryComposer onSubmit={handleEntrySubmit} />
        </div>
      )}

      {/* Pre-Feeling Stage */}
      {stage === 'pre-feeling' && currentEntry && (
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
            <div className="font-semibold mb-1">Entry Created!</div>
            <p className="text-sm">{currentEntry.raw_text}</p>
          </div>

          <FeelingCapture
            when="pre"
            onSubmit={handleFeelingSubmit}
          />

          <button
            onClick={() => setStage('complete')}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            Skip to completion
          </button>
        </div>
      )}

      {/* Post-Feeling Stage (if we implement it) */}
      {stage === 'post-feeling' && currentEntry && (
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <FeelingCapture
            when="post"
            onSubmit={handleFeelingSubmit}
          />

          <button
            onClick={() => {
              addEntry(currentEntry);
              setStage('complete');
              setTimeout(() => {
                navigate('/history');
              }, 1000);
            }}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            Skip post-feeling
          </button>
        </div>
      )}

      {/* Completion Stage */}
      {stage === 'complete' && (
        <div className="bg-white rounded-lg shadow p-8 text-center space-y-6">
          <div className="text-5xl">✅</div>
          <h2 className="text-2xl font-bold text-gray-900">Entry Logged!</h2>
          <p className="text-gray-600">
            Your entry has been saved and will help us generate personalized insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/history')}
              className="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
            >
              View History
            </button>
            <button
              onClick={() => {
                setStage('entry');
                setCurrentEntry(null);
                setSuccessMessage('');
              }}
              className="bg-secondary hover:bg-purple-600 text-white font-bold py-2 px-6 rounded"
            >
              Log Another Entry
            </button>
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
