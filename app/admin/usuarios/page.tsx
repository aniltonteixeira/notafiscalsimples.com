// app/admin/usuarios/page.tsx
'use client';

import { useEffect, useState } from "react";
import { UserService } from "@/modules/user/user-service";
import { SupabaseUserRepository } from "@/modules/user/supabase-user-repository";
import { User } from "@/modules/user/user-repository";

const userService = new UserService(new SupabaseUserRepository());

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const lista = await userService.listUsers();
        setUsuarios(lista);
      } catch (err: any) {
        console.error("Erro ao buscar usuários:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsuarios();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando usuários...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Usuários</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Nome</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Ativo</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td className="border p-2">{usuario.nome}</td>
              <td className="border p-2">{usuario.email}</td>
              <td className="border p-2">{usuario.ativo ? "Sim" : "Não"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
