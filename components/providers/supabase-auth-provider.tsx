"use client";

import { AuthProvider } from "@/lib/supabase-auth";

type Props = {
  children: React.ReactNode;
};

export default function SupabaseAuthProvider({ children }: Props) {
  return <AuthProvider>{children}</AuthProvider>;
} 