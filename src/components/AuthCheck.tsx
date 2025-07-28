import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AuthCheck({ folderRole }: { folderRole: 'admins' | 'students' }) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect(`/${folderRole}/login`);
  }

  const userRole = session.user.user_metadata?.role; // 'admin' or 'student'
  const expectedRole = folderRole.slice(0, -1); // 'admin' or 'student'
  if (userRole !== expectedRole) {
    redirect(`/${folderRole}/login`);
  }

  return null;
}