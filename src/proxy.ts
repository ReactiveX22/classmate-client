import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { authClient } from './lib/auth-client';

const protectedRoutes = ['/dashboard'];

const authRoutes = ['/login'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  let session;

  try {
    session = await authClient.getSession();
  } catch (error) {
    console.error('Failed to get session:', error);
    session = {
      data: null,
    };
  }

  if (isProtectedRoute && !session.data?.session) {
    console.log('[Middleware] Blocking access to protected route:', pathname);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && session.data?.session) {
    console.log('[Middleware] Blocking access to auth route:', pathname);
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
