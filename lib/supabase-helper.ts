import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export function createServerSupabaseClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name) => {
          try {
            const cookieStore = await cookies();
            return cookieStore.get(name)?.value;
          } catch (error) {
            console.error(`[COOKIE_ERROR] Failed to get cookie ${name}:`, error);
            return undefined;
          }
        },
        set: async (name, value, options) => {
          try {
            const cookieStore = await cookies();
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            console.error(`[COOKIE_ERROR] Failed to set cookie ${name}:`, error);
          }
        },
        remove: async (name, options) => {
          try {
            const cookieStore = await cookies();
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            console.error(`[COOKIE_ERROR] Failed to remove cookie ${name}:`, error);
          }
        },
      },
    }
  );
}

export async function getServerSession() {
  const supabase = createServerSupabaseClient();
  try {
    return await supabase.auth.getSession();
  } catch (error) {
    console.error("[AUTH_ERROR] Failed to get server session:", error);
    return { data: { session: null } };
  }
}

export async function getUserFromSession() {
  try {
    const { data: { session } } = await getServerSession();
    return session?.user || null;
  } catch (error) {
    console.error("[AUTH_ERROR] Failed to get user from session:", error);
    return null;
  }
} 