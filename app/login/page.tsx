'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error || !data.session) {
        if (error?.message === "Invalid login credentials") {
          throw new Error("Email ou senha incorretos.");
        }
        throw new Error(error?.message || "Falha no login");
      }

      // Depois do login, buscar dados do usuário
      const { data: userData, error: userError } = await supabase
        .from("usuarios")
        .select("nivel_acesso_id")
        .eq("email", email)
        .single();

      if (userError || !userData) {
        throw new Error("Usuário não encontrado ou sem nível de acesso definido");
      }

      // Redirecionar conforme o nível de acesso
      if ([1, 2].includes(userData.nivel_acesso_id)) {
        router.push("/admin");
      } else if ([3, 4].includes(userData.nivel_acesso_id)) {
        router.push("/dashboard");
      } else {
        throw new Error("Nível de acesso inválido");
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setErro(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96 space-y-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {erro && (
          <p className="text-center text-sm text-red-500">{erro}</p>
        )}

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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
