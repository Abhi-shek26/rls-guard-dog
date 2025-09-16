'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Link from 'next/link';

export default function AuthForm({ defaultIsSignUp = false }: { defaultIsSignUp?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(defaultIsSignUp);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage('Check your email for the confirmation link!');
        setIsSignUp(false); 
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    setError(error.message);
  } else {
    router.push('/dashboard'); 
    router.refresh();
  }
 }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-center">
        {isSignUp ? 'Create an Account' : 'Sign In'}
      </h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</Button>
      </form>
      {error && <p className="mt-4 text-sm text-center text-red-600">{error}</p>}
      {message && <p className="mt-4 text-sm text-center text-green-600">{message}</p>}
 <p className="mt-4 text-sm text-center">
  {isSignUp ? (
    <>
      Already have an account?{' '}
      <Link href="/login" className="font-medium text-blue-600 hover:underline">
        Sign In
      </Link>
    </>
  ) : (
    <>
      Don&apos;t have an account?{' '}
      <Link href="/signup" className="font-medium text-blue-600 hover:underline">
        Sign Up
      </Link>
    </>
    )}
   </p>

    </Card>
  );
}
