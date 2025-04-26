'use client';

import { useState } from "react";

export default function NovoUsuarioPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nivelAcessoId, setNivelAcessoId] = useState<number | "">("");

  const [mensagem, setMensagem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);
    setLoading(true);

    try {
      const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          telefone,
          nivelAcessoId: nivelAcessoId === "" ? null : Number(nivelAcessoId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar usuário");
      }

      setMensagem("Usuário cadastrado com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");
      setTelefone("");
      setNivelAcessoId("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMensagem(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md space-y-4 w-96">
        <h1 className="text-2xl font-bold text-center">Cadastrar Usuário</h1>

        {mensagem && (
          <p className="text-center text-sm text-red-500">{mensagem}</p>
        )}

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Telefone (opcional)"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          placeholder="Nível de Acesso (opcional)"
          value={nivelAcessoId}
          onChange={(e) => {
            const valor = e.target.value;
            setNivelAcessoId(valor === "" ? "" : Number(valor));
          }}
          className="w-full p-2 border rounded"
          min={1}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}
