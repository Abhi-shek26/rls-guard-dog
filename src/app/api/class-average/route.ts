import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { class_id } = await request.json();

  if (!class_id) {
    return NextResponse.json({ error: 'class_id is required' }, { status: 400 });
  }

  // Invoke the Supabase Edge Function
  const { data, error } = await (await supabase).functions.invoke('progress', {
    body: { class_id },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Average calculation triggered successfully.', data });
}
