
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Users2,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verificarSessao = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/"); // Redireciona para login se não autenticado
        return;
      }

      const { data: usuario } = await supabase
        .from("usuarios")
        .select("nome")
        .eq("email", user.email)
        .single();

      setNome(usuario?.nome);
      setLoading(false);
    };

    verificarSessao();
  }, [router]);
  return (
    <>
      {/* Conteúdo */}
      <main className="flex-1 p-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Empresas</h2>
            <p className="text-sm text-muted-foreground">
              Gerencie empresas cadastradas.
            </p>
          </div>
  
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Usuários</h2>
            <p className="text-sm text-muted-foreground">
              Controle os acessos e permissões.
            </p>
          </div>
  
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Notas fiscais</h2>
            <p className="text-sm text-muted-foreground">
              Visualize e audite as emissões.
            </p>
          </div>
        </div>
      </main>
    </>
  );
  
}
