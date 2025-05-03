'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export function useCheckAccessByNivel(permitidos: number[]) {
  const router = useRouter();

  useEffect(() => {
    const verificarAcesso = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user?.email) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("usuarios")
        .select("nivel_acesso_id")
        .eq("email", user.email)
        .single();

      const nivel = data?.nivel_acesso_id;

      if (error || !nivel || !permitidos.includes(nivel)) {
        router.replace("/login");
      }
    };

    verificarAcesso();
  }, [router, permitidos]);
}
