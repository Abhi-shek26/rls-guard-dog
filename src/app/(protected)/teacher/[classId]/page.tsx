import { createClient } from '@/lib/supabase/server';
import TriggerAverageButton from '@/components/teacher/TriggerAverageButton';
import EditProgressForm from '@/components/ui/EditProgressForm';
import { ProgressRecord } from '@/lib/types';

export default async function ClassroomDetailPage({ params }: { params: { classId: string } }) {
  const supabase = createClient();
  const { classId } = params;

  // Call the new parameterized function with the classId from the URL
  const { data: progress, error } = await (await supabase).rpc('get_class_progress', {
    p_classroom_id: classId 
  });

  if (error) {
    console.error("Error fetching class progress:", error);
  }

  // This fetches the classroom name for the header.
  const { data: classroom } = await (await supabase)
    .from('classrooms')
    .select('name')
    .eq('id', classId)
    .single();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{classroom?.name || 'Classroom'} Dashboard</h1>
          <form action="/login" method="post">
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
              Sign Out
            </button>
          </form>
        </div>

        {progress && progress.length > 0 ? (
          <div className="space-y-4">
            {progress.map((record: ProgressRecord) => (
              <EditProgressForm key={record.progress_id} record={record} />
            ))}
          </div>
        ) : (
          <p>No progress records found for this class.</p>
        )}
        
        <TriggerAverageButton classId={classId} />
      </div>
    </div>
  );
}
