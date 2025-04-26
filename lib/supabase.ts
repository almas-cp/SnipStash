import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import { logger } from './utils';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if we're in a server context
const isServer = typeof window === 'undefined';

// Verify environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 'Missing Supabase environment variables';
  
  if (isServer) {
    // On server, log error but don't throw to allow build to continue
    logger.error(errorMessage, { 
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? 'set' : 'missing',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? 'set' : 'missing'
    });
  } else {
    // In browser, log to console
    console.error(errorMessage);
  }
}

// Create a dummy client for when credentials are missing
// This prevents build failures but will throw clear errors when used
const createDummyClient = () => {
  return {
    from: () => {
      throw new Error('Supabase client not properly configured: Missing environment variables');
    },
    auth: {
      signIn: () => {
        throw new Error('Supabase client not properly configured: Missing environment variables');
      },
      signOut: () => {
        throw new Error('Supabase client not properly configured: Missing environment variables');
      }
    }
  } as any;
};

// Global headers for identifying the client
const globalHeaders = { 
  'x-application-name': 'snipstash',
};

// Create a Supabase client for browser usage
export const supabase = isServer || !supabaseUrl || !supabaseAnonKey 
  ? createDummyClient() 
  : createBrowserClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: globalHeaders
      }
    });

// Helper function to create a fresh client when needed (useful in API routes)
export const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    logger.error('Cannot create Supabase client: Missing environment variables');
    throw new Error('Supabase client not properly configured: Missing environment variables');
  }
  
  // Add some randomization to avoid any potential caching issues
  const clientId = `snipstash-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        ...globalHeaders,
        'x-client-id': clientId
      }
    }
  });
};

// Types for your database tables
export type User = {
  id: string;
  email: string;
  name?: string;
  created_at: string;
};

export type Snippet = {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  tags: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}; 