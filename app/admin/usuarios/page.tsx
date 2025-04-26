'use client';

import { useEffect, useState } from "react";
import { User } from "@/modules/user/user-repository";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const response = await fetch("/api/usuarios");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erro ao buscar usuários");
        }

        setUsuarios(data);
      } catch (err: any) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsuarios(); // <<< chamar a função!
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando usuários...</div>;
  }

  if (erro) {
    return <div className="flex items-center justify-center h-screen text-red-500">{erro}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Usuários</h1>
      {usuarios.length === 0 ? (
        <p className="text-center">Nenhum usuário encontrado.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Nome</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Telefone</th>
              <th className="border p-2">Nivel</th>
              <th className="border p-2">Ativo</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td className="border p-2">{usuario.nome}</td>
                <td className="border p-2">{usuario.email}</td>
                <td className="border p-2">{usuario.telefone || "-"}</td>
                <td className="border p-2">{usuario.nivelAcessoId || "-"}</td>
                <td className="border p-2">{usuario.ativo ? "Sim" : "Não"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
