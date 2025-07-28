import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set(name, '', options);
        },
      },
    }
  );

  // Refresh session
  await supabase.auth.getSession();

  // Get session
  const { data: { session }, error } = await supabase.auth.getSession();

  // Define routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admins');
  const isStudentRoute = request.nextUrl.pathname.startsWith('/students');
  const isAuthPage = request.nextUrl.pathname.includes('/login') || request.nextUrl.pathname.includes('/signup');
  const isCallback = request.nextUrl.pathname === '/auth/callback';

  // Skip middleware for callback route to allow Supabase to handle it
  if (isCallback) {
    return response;
  }

  // Redirect logged-in users away from auth pages
  if (session && isAuthPage) {
    const userRole = session.user.app_metadata?.role; // 'admin' or 'student'
    if (userRole && ['admin', 'student'].includes(userRole)) {
      const redirectPath = `/${userRole}s/dashboard`; // Pluralize for URL
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  // Protect admin/student routes
  if (isAdminRoute || isStudentRoute) {
    if (!session) {
      const loginPath = isAdminRoute ? '/admins/login' : '/students/login';
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    // Verify role matches the route
    const userRole = session.user.app_metadata?.role; // 'admin' or 'student'
    const expectedRole = isAdminRoute ? 'admin' : 'student';
    if (userRole !== expectedRole) {
      console.error(`Role mismatch: expected ${expectedRole}, got ${userRole}`);
      const loginPath = isAdminRoute ? '/admins/login' : '/students/login';
      return NextResponse.redirect(new URL(loginPath, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};