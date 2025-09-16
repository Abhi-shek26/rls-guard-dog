import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Card from '@/components/ui/Card';
import SignOutButton from '@/components/auth/SignOutButton';
import { StudentProgress } from '@/lib/types';

export default async function StudentPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    return redirect('/');
  }

  // Fetch progress records. RLS policy ensures students only see their own.
  const { data: progress, error } = await (await supabase)
    .from('progress')
    .select('*, classrooms(name)');

  if (error) {
    console.error('Error fetching progress:', error);
  }

  return (
    <Card className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <SignOutButton />
      </div>
      
      <div className="space-y-4">
        {progress && progress.length > 0 ? (
          progress.map((record: StudentProgress ) => (
            <div key={record.id} className="p-4 border rounded-lg bg-gray-50">
              <p className="font-semibold text-lg">Class: {record.classrooms?.name || 'N/A'}</p>
              <p>Score: <span className="font-mono">{record.score}</span></p>
              <p>Notes: {record.notes || 'No notes'}</p>
            </div>
          ))
        ) : (
          <p>No progress records found.</p>
        )}
      </div>
    </Card>
  );
}
