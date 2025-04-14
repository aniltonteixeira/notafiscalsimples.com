'use client';
//import Image from "next/image";
import { Button } from "@/components/ui/button"; // ou seu path correto

export default function Home() {
  return (
    <>
      <div className="">EMPRESA</div>

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