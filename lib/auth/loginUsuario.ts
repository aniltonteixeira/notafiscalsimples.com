import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";



export async function loginUsuario(email: string, senha: string): Promise<{ erro?: string; tipo?: string }> {

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data: usuario, error } = await supabase
    .from("usuarios")
    .select("senha_hash, tipo")
    .eq("email", email)
    .single();

  if (error || !usuario) {
    return { erro: "Usuário não encontrado." };
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

  if (!senhaCorreta) {
    return { erro: "Senha incorreta." };
  }

  return { tipo: usuario.tipo };
}