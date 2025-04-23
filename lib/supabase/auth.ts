import { createClient } from "@supabase/supabase-js";
import type { Session, User } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export class Auth {
  /**
   * Realiza login com e-mail e senha e retorna o tipo do usuário
   */
  static async login(email: string, senha: string): Promise<{ erro?: string; tipo?: string }> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });

    if (error || !data.session) {
      return { erro: "E-mail ou senha inválidos." };
    }

    const { data: usuario } = await supabase
      .from("usuarios")
      .select("tipo")
      .eq("email", email)
      .single();

    const tipo = usuario?.tipo;

    if (!tipo) {
      return { erro: "Tipo de usuário não definido." };
    }

    return { tipo };
  }

  /**
   * Faz logout do Supabase
   */
  static async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  /**
   * Retorna o usuário logado atualmente (ou null)
   */
  static async getUsuarioAtual(): Promise<User | null> {
    const { data } = await supabase.auth.getSession();
    return data.session?.user ?? null;
  }

  /**
   * Retorna a sessão ativa, se houver
   */
  static async verificarSessao(): Promise<Session | null> {
    const { data } = await supabase.auth.getSession();
    return data.session ?? null;
  }
}
