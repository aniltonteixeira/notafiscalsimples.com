"use client"

import { useEffect, useState } from "react"
import { UsuarioService, Usuario } from "@/lib/database/usuario-service"

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])

  useEffect(() => {
    async function carregarUsuarios() {
      const lista = await UsuarioService.listarUsuarios()
      setUsuarios(lista)
    }

    carregarUsuarios()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Usuários Atual</h1>
      <div className="space-y-2">
        {usuarios.map((usuario) => (
          <div key={usuario.id} className="p-4 bg-gray-100 rounded shadow">
            <p><strong>Nome:</strong> {usuario.nome}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Ativo:</strong> {usuario.ativo ? "Sim" : "Não"}</p>
            <p><strong>Nível de Acesso:</strong> {usuario.nivel_acesso_id}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
