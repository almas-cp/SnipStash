import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// This middleware runs on each request
export async function middleware(request: NextRequest) {
  // Skip middleware for static files
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('/favicon')
  ) {
    return NextResponse.next();
  }

  // Create a Supabase client specific to this middleware request
  const res = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove: (name, options) => {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );
  
  // Check if we have a session
  const { data: { session } } = await supabase.auth.getSession();
  
  const isAuthenticated = !!session;
  const isAuthPage = request.nextUrl.pathname === "/auth";
  const isLandingPage = request.nextUrl.pathname === "/landing";
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isRootPage = request.nextUrl.pathname === "/";
  
  // Allow API routes to handle their own auth
  if (isApiRoute) {
    return res;
  }
  
  // Allow public access to landing page
  if (isLandingPage) {
    return res;
  }
  
  // Core routing logic
  if (isAuthenticated) {
    // User is authenticated
    
    // If on auth or landing page, redirect to home
    if (isAuthPage || isLandingPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    
    // For authenticated users, allow access to protected routes
    return res;
  } else {
    // User is NOT authenticated
    
    // Allow access to auth page
    if (isAuthPage) {
      return res;
    }
    
    // Redirect to landing page (not auth) from root
    if (isRootPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/landing";
      return NextResponse.redirect(url);
    }
    
    // Redirect to auth page from any protected route
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }
}

// Apply middleware to specific routes only
export const config = {
  matcher: [
    '/',
    '/auth',
    '/landing',
    '/dashboard/:path*',
    '/snippets/:path*',
  ],
}; 