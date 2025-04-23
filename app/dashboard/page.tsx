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

export default function Home() {
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

  if (loading) {
    return <p className="p-6">Carregando...</p>;
  }
  return (
    <>
      <div className="">DASHBOARD</div>

      <div>
        <Button
          variant="ghost"
          onClick={() => {
            document.cookie = "usuario_tipo=; path=/; max-age=0";
            window.location.href = "/";
          }}
        >
          Sair
        </Button>
      </div>
    </>
  );
}