import { createClient } from '@supabase/supabase-js';
import { createSupabaseClient } from './supabase';

// Auth service functions
export const authService = {
  // Sign up with email and password
  signUp: async (email: string, password: string, name?: string) => {
    const supabase = createSupabaseClient();
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
        },
      },
    });
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const supabase = createSupabaseClient();
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  // Sign out
  signOut: async () => {
    const supabase = createSupabaseClient();
    return await supabase.auth.signOut();
  },

  // Get user
  getUser: async () => {
    const supabase = createSupabaseClient();
    return await supabase.auth.getUser();
  },

  // Get session
  getSession: async () => {
    const supabase = createSupabaseClient();
    return await supabase.auth.getSession();
  },

  // Reset password
  resetPassword: async (email: string) => {
    const supabase = createSupabaseClient();
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
  },

  // Update user
  updateUser: async (data: { email?: string; password?: string; data?: { name?: string } }) => {
    const supabase = createSupabaseClient();
    return await supabase.auth.updateUser(data);
  },
}; 