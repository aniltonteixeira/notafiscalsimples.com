"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUsuario } from "@/lib/auth/loginUsuario";
import { getSupabaseClient } from "@/lib/supabase/supabaseClient";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const result = await loginUsuario(email, senha);

    if (result.erro) {
      setErro(result.erro);
      setLoading(false);
      return;
    }
    // cria o cookie de sessão válido por 1 dia
    document.cookie = `usuario_tipo=${result.tipo}; path=/; max-age=86400`;
    
    if (result.tipo === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="flex flex-col md:flex-row rounded-xl overflow-hidden max-w-4xl w-full">
        
        {/* LOGO */}
        <div className="flex items-center justify-center p-10 mx-auto w-auto max-w-[400px] sm:max-w-[400px] md:max-w-[450px]">
          <Image
            src="/logonfs.svg"
            alt="Nota Fiscal Simples"
            width={500}
            height={200}
            priority
          />
        </div>

        {/* FORMULÁRIO */}
        <div className="w-full md:w-1/2 p-6">
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0054A6] text-center font-[var(--font-poppins)]">
                Acesse sua conta
              </h2>
            </CardHeader>

            <form onSubmit={handleLogin} className="space-y-4">
              <CardContent className="flex flex-col gap-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus-visible:ring-[#88B3DD]"
                />
                <Input
                  type="password"
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="focus-visible:ring-[#88B3DD]"
                />
                {erro && <p className="text-red-600 text-sm mt-1 ml-1 font-medium animate-shake">{erro}</p>}
              </CardContent>

              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-[#0054A6] hover:bg-[#004080] text-white"
                  disabled={loading}
                >
                  {loading ? "Entrando..." : "ENTRAR"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
