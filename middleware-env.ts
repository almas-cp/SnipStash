import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs on each request
export function middleware(request: NextRequest) {
  // Only log on specific paths to avoid excessive logging
  if (request.nextUrl.pathname.startsWith('/api/auth') || 
      request.nextUrl.pathname.startsWith('/api/register')) {
    
    // Check for required environment variables
    const envVars = {
      'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓' : '✗',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓' : '✗',
      'NEXTAUTH_URL': process.env.NEXTAUTH_URL ? '✓' : '✗',
      'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET ? '✓' : '✗',
    };

    console.log('[ENV_CHECK] Environment variables status:');
    for (const [key, value] of Object.entries(envVars)) {
      console.log(`[ENV_CHECK] ${key}: ${value}`);
    }
    
    // If Supabase URL is not set, log a clear error message
    if (envVars['NEXT_PUBLIC_SUPABASE_URL'] === '✗') {
      console.error('[ENV_CHECK] ERROR: NEXT_PUBLIC_SUPABASE_URL is not set. Set this in your Vercel project settings.');
    }
    
    // If Supabase key is not set, log a clear error message
    if (envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'] === '✗') {
      console.error('[ENV_CHECK] ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Set this in your Vercel project settings.');
    }
  }

  return NextResponse.next();
}

// Configure the paths this middleware runs on
export const config = {
  matcher: ['/api/auth/:path*', '/api/register'],
}; 