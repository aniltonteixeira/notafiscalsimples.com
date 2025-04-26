// src/modules/user/supabase-user-repository.ts
import { User, UserRepository } from "./user-repository";
import { supabase } from "@/lib/supabase/client";
import { supabaseServer } from "@/lib/supabase/server"; 

import bcrypt from "bcryptjs";

export class SupabaseUserRepository implements UserRepository {
  
  async create(user: User): Promise<void> {

    const { data: authUser, error: authError } = await supabaseServer.auth.admin.createUser({
      email: user.email,
      password: user.senha!,
      email_confirm: true,
    });

    if (authError) {
      throw new Error("Erro ao criar usuário na autenticação: " + authError.message);
    }

    const senhaHash = await bcrypt.hash(user.senha!, 10);

    const { error } = await supabase.from('usuarios').insert({
      nome: user.nome.trim(),
      email: user.email.trim().toLowerCase(),
      senha_hash: senhaHash,
      telefone: user.telefone?.trim() || null,
      ativo: user.ativo ?? true,
      nivel_acesso_id: user.nivelAcessoId || null,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async findAll(): Promise<User[]> {
    const { data, error } = await supabase.from('usuarios').select(`
      id,
      nome,
      email,
      telefone,
      ativo,
      nivel_acesso_id
    `);
  
    if (error) {
      throw new Error(error.message);
    }
  
    if (!data) {
      return [];
    }
  
    return data.map((item) => ({
      id: item.id,
      nome: item.nome,
      email: item.email,
      telefone: item.telefone,
      ativo: item.ativo,
      nivelAcessoId: item.nivel_acesso_id,
    })) as User[];
  }
  

  async update(user: User): Promise<void> {
    if (!user.id) throw new Error("ID é obrigatório para atualizar usuário");

    const fieldsToUpdate: any = {
      nome: user.nome.trim(),
      email: user.email.trim().toLowerCase(),
      telefone: user.telefone?.trim() || null,
      nivel_acesso_id: user.nivelAcessoId || null,
      ativo: user.ativo ?? true,
    };

    if (user.senha) {
      const senhaHash = await bcrypt.hash(user.senha, 10);
      fieldsToUpdate.senha_hash = senhaHash;
    }

    const { error } = await supabase.from('usuarios')
      .update(fieldsToUpdate)
      .eq('id', user.id);

    if (error) {
      throw new Error(error.message);
    }
  }

  async inactivate(id: string): Promise<void> {
    const { error } = await supabase.from('usuarios')
      .update({ ativo: false })
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
}
