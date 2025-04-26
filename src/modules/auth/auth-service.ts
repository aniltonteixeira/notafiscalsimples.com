// src/modules/auth/auth-service.ts
import { supabase } from "@/lib/supabase/client";

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
