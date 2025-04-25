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
  Home,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { ReactNode } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verificarSessao = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/");
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
    <div className="flex h-screen overflow-hidden bg-[#F7F9FC] relative">
      {/* Botão de esconder/mostrar sidebar (somente em telas md+) */}


      {/* Sidebar - Desktop */}
      {sidebarAberta && (
        <aside className="hidden md:flex w-64 bg-white border-r shadow-sm flex-col h-screen z-40">
          <div className="flex items-center gap-2 px-6 py-4 border-b">
            <Link href="/admin">
              <Image src="/logonfs.svg" alt="Logo" width={180} height={40} />
            </Link>
          </div>
          <button
        className="hidden md:block fixed top-4 left-4 z-50 bg-white border p-2 rounded shadow"
        onClick={() => setSidebarAberta(!sidebarAberta)}
      >
        {sidebarAberta ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
      </button>
          <nav className="flex-1 p-4 space-y-2 text-sm overflow-y-auto">
            <Link href="/admin" className="flex items-center gap-2 p-2 rounded hover:bg-blue-50">
              <Home size={18} /> Home
            </Link>
            <Link href="/admin/empresas" className="flex items-center gap-2 p-2 rounded hover:bg-blue-50">
              <Building2 size={18} /> Empresas
            </Link>
            <Link href="/admin/usuarios" className="flex items-center gap-2 p-2 rounded hover:bg-blue-50">
              <Users2 size={18} /> Usuários
            </Link>
            <Link href="/admin/notas" className="flex items-center gap-2 p-2 rounded hover:bg-blue-50">
              <FileText size={18} /> Notas fiscais
            </Link>
            <Link href="/admin/planos" className="flex items-center gap-2 p-2 rounded hover:bg-blue-50">
              <FileText size={18} /> Planos
            </Link>
          </nav>
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-700 hover:bg-red-400 text-white-700"
              onClick={async () => {
                await supabase.auth.signOut();
                document.cookie = "usuario_tipo=; path=/; max-age=0";
                window.location.href = "/";
              }}
            >
              <LogOut size={18} /> Sair
            </Button>
          </div>
        </aside>
      )}

      {/* Sidebar Mobile */}
      {menuAberto && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMenuAberto(false)} />
      )}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r z-50 transition-transform md:hidden ${menuAberto ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <Image src="/logonfs.svg" alt="Logo" width={150} height={40} />
          <button onClick={() => setMenuAberto(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2 text-sm">
          <Link href="/admin" className="flex items-center gap-2 p-2 rounded hover:bg-blue-50">
            <Home size={18} /> Home
          </Link>
          <Link href="/admin/empresas" className="flex items-center gap-2 p-2 rounded hover:bg-blue-100" onClick={() => setMenuAberto(false)}>
            <Building2 size={18} /> Empresas
          </Link>
          <Link href="/admin/usuarios" className="flex items-center gap-2 p-2 rounded hover:bg-blue-100" onClick={() => setMenuAberto(false)}>
            <Users2 size={18} /> Usuários
          </Link>
          <Link href="/admin/notas" className="flex items-center gap-2 p-2 rounded hover:bg-blue-100" onClick={() => setMenuAberto(false)}>
            <FileText size={18} /> Notas fiscais
          </Link>
          <Link href="/admin/planos" className="flex items-center gap-2 p-2 rounded hover:bg-blue-100" onClick={() => setMenuAberto(false)}>
            <FileText size={18} /> Planos
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 mt-4"
            onClick={async () => {
              await supabase.auth.signOut();
              location.replace("/");
            }}
          >
            <LogOut size={18} /> Sair
          </Button>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarAberta ? "md:ml-64" : ""}`}>
        <header className="flex items-center justify-between p-4 shadow-sm bg-white md:hidden">
          <button onClick={() => setMenuAberto(true)}>
            <Menu size={24} />
          </button>
          <span className="text-[#0054A6] font-bold">Painel</span>
          <div className="w-6" />
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-[#0054A6] mb-4">
            Bem-vindo, {nome}!
          </h1>
          <Separator className="mb-6" />
          {children}
        </main>
      </div>
    </div>
  );
}
