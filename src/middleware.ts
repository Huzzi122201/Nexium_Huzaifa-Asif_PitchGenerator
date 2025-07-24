import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  try {
    const supabase = createMiddlewareClient({ req, res });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Auth routes - redirect to dashboard if logged in
    if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Protected routes - redirect to login if not logged in
    if (!session && (req.nextUrl.pathname.startsWith('/create') || req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/pitch/'))) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return res;
  } catch (error) {
    return res;
  }
}

// Specify which routes should trigger this middleware
export const config = {
  matcher: [
    '/login',
    '/signup',
    '/dashboard/:path*',
    '/create/:path*',
    '/pitch/:path*',
  ],
}; 