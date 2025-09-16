import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <Card>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
        <p className="mb-6">
          There was a problem authenticating your account. Please try signing in again.
        </p>
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          Go to Login
        </Link>
      </div>
    </Card>
  );
}
