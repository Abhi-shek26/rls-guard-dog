'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '../ui/Button';

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <Button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700">
      Sign Out
    </Button>
  );
}
