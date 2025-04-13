"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <Image src="/logonfs.svg" alt="Logo" width={150} height={40} />
          <span className="text-[#0054A6] font-bold text-lg hidden md:inline">Painel Administrativo</span>
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            document.cookie = "usuario_tipo=; path=/; max-age=0";
            window.location.href = "/";
          }}
        >
          Sair
        </Button>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-[#0054A6] mb-4">Bem-vindo, administrador!</h1>
        <Separator className="mb-6" />

        <div className="grid md:grid-cols-3 gap-6">
          {/* cards de ações */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Empresas</h2>
            <p className="text-sm text-muted-foreground">Gerencie empresas cadastradas.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Usuários</h2>
            <p className="text-sm text-muted-foreground">Controle os acessos e permissões.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Notas fiscais</h2>
            <p className="text-sm text-muted-foreground">Visualize e audite as emissões.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
