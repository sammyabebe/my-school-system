import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AuthCallback() {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/signin');
  }

  const role = session.user.user_metadata?.role;
  if (!role || !['admin', 'student'].includes(role)) {
    console.error('Invalid or missing role in user_metadata:', role);
    redirect('/signin');
  }

  redirect(`/${role}s/dashboard`);
}