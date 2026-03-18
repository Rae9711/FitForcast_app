import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FeelingCaptureProps {
  onSubmit: (feelings: {
    when: 'pre' | 'post';
    valence: number;
    energy: number;
    stress: number;
    notes?: string;
  }) => void;
  when: 'pre' | 'post';
  isLoading?: boolean;
}

export const FeelingCapture: React.FC<FeelingCaptureProps> = ({
  onSubmit,
  when,
  isLoading = false,
}) => {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      // Backend expects 1–5 integers; keep UI sliders but map their values.
      valence: '3',
      energy: '3',
      stress: '3',
      notes: '',
    },
  });

  const valence = watch('valence');
  const energy = watch('energy');
  const stress = watch('stress');

  const onSubmitForm = handleSubmit((data) => {
    // Ensure we always send 1–5 integers to the backend.
    const clampToScale = (raw: string) => {
      const n = parseInt(raw, 10);
      if (Number.isNaN(n)) return 3;
      return Math.min(5, Math.max(1, n));
    };

    onSubmit({
      when,
      valence: clampToScale(data.valence),
      energy: clampToScale(data.energy),
      stress: clampToScale(data.stress),
      notes: data.notes || undefined,
    });
  });

  const getValenceLabel = (val: number) => {
    if (val < -50) return 'Very Negative';
    if (val < -20) return 'Negative';
    if (val < 20) return 'Neutral';
    if (val < 50) return 'Positive';
    return 'Very Positive';
  };

  return (
    <form onSubmit={onSubmitForm} className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        {when === 'pre' ? 'How are you feeling before?' : 'How are you feeling after?'}
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Mood: {getValenceLabel(parseInt(valence))}
        </label>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          {...register('valence')}
          className="mt-2 w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Very Sad</span>
          <span>Neutral</span>
          <span>Very Happy</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Energy Level: {parseInt(energy)} / 5
        </label>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          {...register('energy')}
          className="mt-2 w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Exhausted</span>
          <span>Energized</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Stress Level: {parseInt(stress)} / 5
        </label>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          {...register('stress')}
          className="mt-2 w-full accent-danger"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Relaxed</span>
          <span>Very Stressed</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
        <textarea
          {...register('notes')}
          placeholder="Add any additional notes..."
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-secondary hover:bg-purple-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-md transition"
      >
        {isLoading ? 'Saving...' : 'Record Feeling'}
      </button>
    </form>
  );
};