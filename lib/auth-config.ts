// This file centralizes auth configuration to ensure consistent values
// across server components, API routes, and middleware

import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { SessionStrategy } from "next-auth";

// Add custom type declaration to extend NextAuth Session
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// For production, use a properly generated key stored in environment variables
export const AUTH_SECRET = "f4a9d302a89e4d128b23be5431c2fd74c0950bb934754d1db97fb50c29f9c9f0";

// Check if we're running on the server or in a serverless function
const isProduction = process.env.NODE_ENV === "production";
// Get base URL from environment or fallback for development
const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const AUTH_CONFIG = {
  secret: AUTH_SECRET,
  pages: {
    signIn: "/auth",
    signOut: "/",
    error: "/auth", // Error code passed in query string as ?error=
    verifyRequest: "/auth", // (used for check email message)
  },
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax" as "lax" | "strict" | "none",
        path: "/",
        secure: isProduction
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax" as "lax" | "strict" | "none",
        path: "/",
        secure: isProduction
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax" as "lax" | "strict" | "none",
        path: "/",
        secure: isProduction
      }
    }
  },
  callbacks: {
    session: ({ session, token }: { session: Session; token: JWT }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    redirect: ({ url, baseUrl }: { url: string; baseUrl: string }) => {
      console.log(`[AUTH] Redirect - URL: ${url}, BaseURL: ${baseUrl}`);
      
      // If the URL is absolute and doesn't start with the base URL
      // Only allow production URLs in production or any URL in development
      if (url.startsWith("http")) {
        if (isProduction) {
          // In production, only allow redirects to URLs within our domain
          const prodUrl = new URL(url);
          const baseUrlObj = new URL(baseUrl);
          
          if (prodUrl.hostname === baseUrlObj.hostname) {
            console.log(`[AUTH] Allowing absolute URL redirect to: ${url}`);
            return url;
          }
          
          console.log(`[AUTH] Rejecting external redirect to: ${url}`);
          return baseUrl;
        }
        
        // In development, allow any URL
        return url;
      }
      
      // Handle relative URLs
      // If it's a sign-in or callback URL, redirect to homepage after auth
      if (url.startsWith("/api/auth/signin") || url.startsWith("/api/auth/callback")) {
        console.log(`[AUTH] Auth operation completed, redirecting to homepage`);
        return baseUrl;
      }
      
      // For auth page, allow it
      if (url.startsWith("/auth")) {
        console.log(`[AUTH] Redirecting to auth page`);
        return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
      }
      
      console.log(`[AUTH] Default case - redirecting to: ${url}`);
      // For other relative URLs, keep them as is
      return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
    }
  },
  debug: process.env.NODE_ENV === "development",
}; 