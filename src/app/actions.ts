'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProgress(formData: FormData) {
  const supabase = createClient();

  // Get the form data
  const id = formData.get('id');
  const score = formData.get('score');
  const notes = formData.get('notes');

  // Validate the data
  if (!id || !score) {
    return { error: 'Missing required fields' };
  }

  // Perform the update in the database
  const { error } = await (await supabase).rpc('update_progress_record', {
    p_id: Number(id),
    p_score: Number(score),
    p_notes: notes as string
  });

  if (error) {
    console.error('Update Error:', error);
    return { error: 'Failed to update progress.' };
  }
  revalidatePath('/teacher');
}
