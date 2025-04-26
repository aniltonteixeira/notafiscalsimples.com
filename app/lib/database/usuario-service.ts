import { supabase } from "@/lib/supabase/client"

export type Usuario = {
  id: string
  nome: string
  email: string
  ativo: boolean
  nivel_acesso_id: number
}

export class UsuarioService {
  static async listarUsuarios(): Promise<Usuario[]> {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nome, email, ativo, nivel_acesso_id")

    if (error) {
      console.error("Erro ao buscar usuários:", error)
      return []
    }

    return data || []
  }
}
