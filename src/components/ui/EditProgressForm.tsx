'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProgress } from '@/app/actions';
import SubmitButton from './SubmitButton'; // <-- Import the new component

export default function EditProgressForm({ record }: { record: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  if (!isEditing) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold">Student: {record.student_name}</p>
            <p>Class: {record.classroom_name}</p>
            <p>Score: <span className="font-mono">{record.score}</span></p>
            <p>Notes: {record.notes || 'No notes'}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Edit
          </button>
        </div>
      </div>
    );
  }


  return (
    <form
      // When the form submits, it will re-render the parent, showing the latest data
      action={async (formData) => {
        await updateProgress(formData);
        setIsEditing(false);
        router.refresh();
      }}
      className="p-4 border rounded-lg bg-blue-50 space-y-3"
    >
      <input type="hidden" name="id" value={record.progress_id} />
      <div>
        <p className="font-semibold">Student: {record.student_name}</p>
        <p>Class: {record.classroom_name}</p>
      </div>
      <div>
        <label htmlFor="score" className="block text-sm font-medium text-gray-700">Score</label>
        <input
          type="number"
          name="score"
          id="score"
          defaultValue={record.score}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          name="notes"
          id="notes"
          defaultValue={record.notes || ''}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="flex items-center space-x-2">
        <SubmitButton /> 
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
