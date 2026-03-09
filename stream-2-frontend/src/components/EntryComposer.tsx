import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Entry } from '../types/index';

interface EntryComposerProps {
  onSubmit: (type: 'workout' | 'meal', raw_text: string, occurred_at: string) => void;
  isLoading?: boolean;
}

export const EntryComposer: React.FC<EntryComposerProps> = ({ onSubmit, isLoading = false }) => {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      type: 'workout' as 'workout' | 'meal',
      raw_text: '',
      occurred_at: new Date().toISOString().split('T')[0],
    },
  });

  const watchType = watch('type');

  const onSubmitForm = handleSubmit((data) => {
    const occurredAt = new Date(data.occurred_at).toISOString();
    onSubmit(data.type, data.raw_text, occurredAt);
    reset();
  });

  return (
    <form onSubmit={onSubmitForm} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Entry Type
        </label>
        <select
          {...register('type')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
        >
          <option value="workout">Workout</option>
          <option value="meal">Meal</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {watchType === 'workout' ? 'Describe your workout' : 'Describe your meal'}
        </label>
        <textarea
          {...register('raw_text', { required: true })}
          placeholder={
            watchType === 'workout'
              ? 'e.g., 5km morning run, felt strong'
              : 'e.g., Grilled chicken with vegetables'
          }
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          When did this happen?
        </label>
        <input
          type="date"
          {...register('occurred_at')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-md transition"
      >
        {isLoading ? 'Saving...' : 'Log Entry'}
      </button>
    </form>
  );
};
