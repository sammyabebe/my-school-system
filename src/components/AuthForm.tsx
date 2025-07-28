'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type FolderRole = 'admins' | 'students';
type DBRole = 'admin' | 'student';

interface AuthFormProps {
  folderRole: FolderRole;
  isSignup?: boolean;
}

export default function AuthForm({ folderRole, isSignup = false }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const roleMap: Record<FolderRole, DBRole> = {
    admins: 'admin',
    students: 'student',
  };
  const dbRole: DBRole = roleMap[folderRole];
  const roleName = dbRole.charAt(0).toUpperCase() + dbRole.slice(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      if (isSignup) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: dbRole },
            emailRedirectTo: `${window.location.origin}/${folderRole}/dashboard`,
          },
        });
        if (signUpError) throw signUpError;
        setMessage('Check your email for confirmation!');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push(`/${folderRole}/dashboard`);
      }
    } catch (err: any) {
      setError(
        err.code === 'user_already_exists'
          ? 'This email is already registered.'
          : err.code === 'invalid_credentials'
          ? 'Invalid email or password.'
          : err.message || 'An error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {isSignup ? `Create ${roleName} Account` : `${roleName} Sign In`}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded text-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={`${dbRole}@example.com`}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Processing...' : isSignup ? 'Sign Up' : 'Sign In'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        {isSignup ? (
          <p>
            Already have an account?{' '}
            <Link href={`/${folderRole}/login`} className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        ) : (
          <p>
            Need an account?{' '}
            <Link href={`/${folderRole}/signup`} className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}