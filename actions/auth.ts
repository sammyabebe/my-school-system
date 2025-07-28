'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function signUp(email: string, password: string, role: 'admin' | 'student') {
  // Step 1: Create auth user
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { initial_role: role }
    }
  });
  
  if (authError) return { error: authError.message };
  if (!data.user) return { error: 'User creation failed' };
  
  // Step 2: Add to public.users table
  const { error: dbError } = await supabase
    .from('users')
    .insert({
      id: data.user.id,
      email,
      role
    });
  
  if (dbError) return { error: dbError.message };
  
  return { success: true };
}