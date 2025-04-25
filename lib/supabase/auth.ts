// lib/supabase/auth.ts
import { supabase } from "@/lib/supabase/client";

export const Auth = {
  async login(email: string, senha: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      return { erro: "Email ou senha inválidos." };
    }

    const usuario = data.user;

    // Busca dados extras na tabela "usuarios"
    const { data: userInfo, error: userError } = await supabase
      .from("usuarios")
      .select("ativo, nivel_acesso_id")
      .eq("email", email)
      .single();

    if (userError || !userInfo) {
      return { erro: "Usuário não encontrado no sistema." };
    }

    if (!userInfo.ativo) {
      return { erro: "Usuário inativo. Contate o administrador." };
    }

    return {
      usuario,
      tipo: userInfo.nivel_acesso_id,
    };
  },

  async getUsuarioAtual() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  },

  async verificarSessao() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session;
  },

  async logout() {
    await supabase.auth.signOut();
  },
};
