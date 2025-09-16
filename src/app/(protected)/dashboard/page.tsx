import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    return redirect('/');
  }

  // Fetch the user's profile to get their role
  const { data: profile, error } = await (await supabase)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    return redirect('/');
  }

  // Redirect based on the role
  if (profile.role === 'teacher' || profile.role === 'head_teacher') {
    return redirect('/teacher');
  } else if (profile.role === 'student') {
    return redirect('/student');
  } else {
    return redirect('/');
  }
}
