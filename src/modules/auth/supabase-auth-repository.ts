import { AuthRepository } from "./auth-repository";
import { supabase } from "@/lib/supabase/client";

export class SupabaseAuthRepository implements AuthRepository {
  async login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(error.message);
    }
  }
}
