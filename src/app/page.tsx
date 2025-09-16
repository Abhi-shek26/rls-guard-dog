import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <Card>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to RLS Guard Dog</h1>
        <p className="mb-6 text-gray-600">
          A demonstration of Supabase Row-Level Security with Next.js.
        </p>
          <Button as="a" href="/login">Login or Sign Up</Button>
      </div>
    </Card>
  );
}
