import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Classroom } from '@/lib/types';

export default async function TeacherDashboard() {
  const supabase = createClient();

  const { data: { user } } = await (await supabase).auth.getUser();

  let classrooms: { id: string; name:string; }[] = [];

  if (user) {
    // First, get the user's profile to determine their role and school
    const { data: profile } = await (await supabase)
      .from('profiles')
      .select('role, school_id')
      .eq('id', user.id)
      .single();

    if (profile) {      
      // If the user is a headteacher, fetch all classrooms in their school.
      if (profile.role === 'head_teacher') {
        const { data: schoolClassrooms, error } = await (await supabase)
          .from('classrooms')
          .select('id, name')
          .eq('school_id', profile.school_id);
        
        if (error) console.error("Error fetching school classrooms for headteacher:", error);
        else classrooms = schoolClassrooms || [];

      // If the user is a regular teacher, fetch only their assigned classrooms.
      } else if (profile.role === 'teacher') {
        const { data: assignments, error } = await (await supabase)
          .from('teacher_assignments')
          .select('classrooms(id, name)')
          .eq('teacher_id', user.id);

        if (error) console.error("Error fetching assigned classrooms for teacher:", error);
        else if (assignments) {
          classrooms = assignments
            .flatMap((item: { classrooms: { id: string; name: string }[] }) => item.classrooms)
            .filter(Boolean) as Classroom[];
        }
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Select a Classroom</h1>
        {classrooms.length > 0 ? (
          <ul className="space-y-2">
            {classrooms.map((classroom : Classroom) => (
              <li key={classroom.id}>
                <Link 
                  href={`/teacher/${classroom.id}`} 
                  className="block w-full px-4 py-3 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  {classroom.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">You are not assigned to any classrooms.</p>
        )}
      </div>
    </div>
  );
}
