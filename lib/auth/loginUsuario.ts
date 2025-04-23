import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function loginUsuario(email: string, senha: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error || !data.session) {
    return { erro: "Credenciais inválidas." };
  }

  const { user } = data;

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("tipo")
    .eq("email", user.email)
    .single();

  return { tipo: usuario?.tipo ?? "comum" };
}
