import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function StudentDashboard() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'student') {
    redirect('/students/login');
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>
      <p className="mt-4">Welcome, {user.email}!</p>
    </div>
  );
}