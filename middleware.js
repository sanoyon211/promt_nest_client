import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check for the access token cookie
  const token = request.cookies.get('access-token');
  const path = request.nextUrl.pathname;

  // Define paths
  const isDashboardPath = path.startsWith('/dashboard');
  const isAuthPath = path === '/login' || path === '/register';

  // 1. If trying to access dashboard but not logged in -> redirect to login
  if (isDashboardPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. If trying to access login/register but already logged in -> redirect to dashboard
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register'
  ],
};
