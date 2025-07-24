import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');

  console.log('Auth callback hit with:', {
    code: code ? 'EXISTS' : 'MISSING',
    error,
    error_description,
    url: requestUrl.href
  });

  if (error) {
    console.error('Auth callback error:', error, error_description);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error_description || error)}`, request.url));
  }

  if (code) {
    try {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      
      console.log('Exchanging code for session...');
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('Code exchange error:', exchangeError);
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, request.url));
      }

      console.log('Session created successfully:', {
        user: data.user?.id,
        session: data.session ? 'EXISTS' : 'MISSING'
      });

      // Verify the session was created
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('User verification:', {
        user: user?.id || 'NO USER',
        error: userError?.message || 'NO ERROR'
      });

      if (user) {
        console.log('Redirecting to dashboard...');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } else {
        console.log('No user after session creation, redirecting to login...');
        return NextResponse.redirect(new URL('/login?error=session_creation_failed', request.url));
      }
    } catch (error) {
      console.error('Auth callback exception:', error);
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent('Authentication failed')}`, request.url));
    }
  }

  console.log('No code provided, redirecting to login...');
  return NextResponse.redirect(new URL('/login?error=no_code_provided', request.url));
} 